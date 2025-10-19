import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty } from "@prisma/client";
import { formatDateInTimezone, isValidTimezone } from "@/lib/utils/timezone";

// Helper function to safely map and validate difficulty parameter
function mapOrValidateDifficulty(difficultyParam: string | null): Difficulty | null {
  if (!difficultyParam) return null;
  
  const upperDifficulty = difficultyParam.toUpperCase();
  if (upperDifficulty === "EASY") return Difficulty.EASY;
  if (upperDifficulty === "MEDIUM") return Difficulty.MEDIUM;
  if (upperDifficulty === "HARD") return Difficulty.HARD;
  
  return null; // Invalid difficulty
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { 
      status: 401,
      headers: { 
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject")?.trim();
  const dateRange = searchParams.get("dateRange");
  const difficulty = searchParams.get("difficulty");
  const timezone = searchParams.get("timezone") || "UTC";

  // Validate timezone parameter
  if (!isValidTimezone(timezone)) {
    return NextResponse.json(
      { 
        error: "Invalid timezone. Must be a valid IANA timezone string (e.g., 'America/Los_Angeles', 'Europe/London', 'UTC')" 
      }, 
      { 
        status: 400,
        headers: { 
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }

  // Validate and normalize difficulty parameter
  const safeDifficulty = mapOrValidateDifficulty(difficulty);
  if (difficulty && !safeDifficulty) {
    return NextResponse.json(
      { 
        error: "Invalid difficulty value. Must be one of: EASY, MEDIUM, HARD" 
      }, 
      { 
        status: 400,
        headers: { 
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }

  // Parse and validate dateRange parameter
  let dateFilter: { gte?: Date; lte?: Date } | undefined = undefined;
  if (dateRange) {
    try {
      const dates = dateRange.split(',').map(d => d.trim());
      
      if (dates.length === 1) {
        const date = new Date(dates[0]);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }
        dateFilter = { gte: date };
      } else if (dates.length === 2) {
        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[1]);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date format");
        }
        
        if (startDate > endDate) {
          return NextResponse.json(
            { 
              error: "Start date must be before or equal to end date" 
            }, 
            { 
              status: 400,
              headers: { 
                "Cache-Control": "no-cache, no-store, must-revalidate"
              }
            }
          );
        }
        
        dateFilter = { gte: startDate, lte: endDate };
      } else {
        throw new Error("Invalid date range format");
      }
    } catch (error) {
      return NextResponse.json(
        { 
          error: "Invalid date format. Use ISO date format (YYYY-MM-DD) or comma-separated range (YYYY-MM-DD,YYYY-MM-DD)" 
        }, 
        { 
          status: 400,
          headers: { 
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        }
      );
    }
  }

  try {
    // Fetch study records grouped by subject (deck name)
    const studyRecords = await prisma.studyRecord.findMany({
      where: {
        flashcard: {
          userId: user.id,
          deck: subject ? { 
            is: {
              name: {
                equals: subject,
                mode: "insensitive"
              }
            }
          } : undefined,
          difficulty: safeDifficulty ? { equals: safeDifficulty } : undefined,
        },
        createdAt: dateFilter,
      },
      include: {
        flashcard: {
          include: {
            deck: true,
          }
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by deck and calculate progress over time
    const subjectData: { [subject: string]: { [date: string]: { correct: number; total: number } } } = {};
    
    studyRecords.forEach((record) => {
      const deckName = record.flashcard.deck.name;
      // Format date in the user's timezone to ensure correct date grouping
      const date = formatDateInTimezone(record.createdAt, timezone);
      
      if (!subjectData[deckName]) {
        subjectData[deckName] = {};
      }
      
      if (!subjectData[deckName][date]) {
        subjectData[deckName][date] = { correct: 0, total: 0 };
      }
      
      subjectData[deckName][date].total++;
      if (record.isCorrect) {
        subjectData[deckName][date].correct++;
      }
    });

    // Build lookup map for each subject: date -> accuracy
    const subjectLookups = Object.entries(subjectData).map(([subject, dateData]) => {
      const dateToAccuracy: { [date: string]: number } = {};
      
      Object.entries(dateData).forEach(([date, stats]) => {
        const { correct, total } = stats;
        dateToAccuracy[date] = total > 0 ? (correct / total) * 100 : 0;
      });
      
      return {
        label: subject,
        dateToAccuracy,
        dates: Object.keys(dateData),
      };
    });

    // If no data, return empty dataset
    if (subjectLookups.length === 0) {
      return NextResponse.json({
        labels: [],
        datasets: []
      }, {
        status: 200,
        headers: { 
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
      });
    }

    // Get all unique dates across all subjects
    const allDates = [...new Set(subjectLookups.flatMap(d => d.dates))].sort();

    // Build aligned datasets: each dataset.data has same length as allDates
    const datasets = subjectLookups.map(({ label, dateToAccuracy }) => ({
      label,
      data: allDates.map(date => dateToAccuracy[date] ?? null),
    }));

    return NextResponse.json({
      labels: allDates,
      datasets,
    }, {
      status: 200,
      headers: { 
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
    });
  } catch (error) {
    console.error("Failed to compute subject progress:", error);
    return NextResponse.json(
      { 
        error: "Failed to compute subject progress"
      }, 
      {
        status: 500,
        headers: { 
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
      }
    );
  }
}


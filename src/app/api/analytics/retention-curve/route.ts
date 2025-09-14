
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty } from "@prisma/client";

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
      // Check if it's a single date or date range (comma-separated)
      const dates = dateRange.split(',').map(d => d.trim());
      
      if (dates.length === 1) {
        // Single date - use as gte
        const date = new Date(dates[0]);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }
        dateFilter = { gte: date };
      } else if (dates.length === 2) {
        // Date range - use first as gte, second as lte
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
      orderBy: { createdAt: "asc" },
    });
    const retentionData = studyRecords.reduce((acc: { [key: string]: { correct: number; total: number } }, record: { createdAt: Date; isCorrect: boolean }) => {
      const date = new Date(record.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { correct: 0, total: 0 };
      }
      acc[date].total++;
      if (record.isCorrect) {
        acc[date].correct++;
      }
      return acc;
    }, {} as { [key: string]: { correct: number; total: number } });

    const labels = Object.keys(retentionData);
    const retention = Object.values(retentionData).map((d: { correct: number; total: number }) => (d.correct / d.total) * 100);

    return NextResponse.json({ labels, retention }, {
      status: 200,
      headers: { 
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
    });
  } catch (error) {
    console.error("Failed to compute retention curve:", error);
    return NextResponse.json(
      { 
        error: "Failed to compute retention", 
        details: error instanceof Error ? error.message : "Unknown error"
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

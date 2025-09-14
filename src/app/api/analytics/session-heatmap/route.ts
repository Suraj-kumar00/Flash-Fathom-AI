
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject")?.trim();
  const dateRange = searchParams.get("dateRange");

  // Parse and validate dateRange parameter
  let validatedDate: Date | undefined = undefined;
  if (dateRange) {
    try {
      const parsedDate = new Date(dateRange);
      if (!isFinite(parsedDate.getTime())) {
        return new NextResponse(
          JSON.stringify({ 
            error: "Invalid dateRange format. Use ISO date format (YYYY-MM-DD)" 
          }), 
          { status: 400 }
        );
      }
      validatedDate = parsedDate;
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Invalid dateRange format. Use ISO date format (YYYY-MM-DD)" 
        }), 
        { status: 400 }
      );
    }
  }

  try {
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        startTime: validatedDate ? { gte: validatedDate } : undefined,
        records: subject
          ? {
              some: {
                flashcard: {
                  deck: { 
                    name: {
                      equals: subject,
                      mode: "insensitive"
                    }
                  },
                },
              },
            }
          : undefined,
      },
      select: {
        startTime: true,
      },
    });

    const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));

    studySessions.forEach((session: { startTime: Date }) => {
      const day = new Date(session.startTime).getDay();
      const hour = new Date(session.startTime).getHours();
      if (heatmapData[day]) {
        heatmapData[day][hour]++;
      }
    });

    return new NextResponse(JSON.stringify(heatmapData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch session heatmap data:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to fetch session heatmap data",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";
import { getDayInTimezone, getHourInTimezone, isValidTimezone } from "@/lib/utils/timezone";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject")?.trim();
  const dateRange = searchParams.get("dateRange");
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
          "cache-control": "no-store"
        }
      }
    );
  }

  // Parse and validate dateRange parameter
  let validatedDate: Date | undefined = undefined;
  if (dateRange) {
    try {
      const parsedDate = new Date(dateRange);
      if (!isFinite(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid dateRange format. Use ISO date format (YYYY-MM-DD)" },
          { status: 400, headers: { "cache-control": "no-store" } }
        );
      }
      validatedDate = parsedDate;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid dateRange format. Use ISO date format (YYYY-MM-DD)" },
        { status: 400, headers: { "cache-control": "no-store" } }
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
      // Get day and hour in the user's timezone to ensure correct heatmap placement
      const day = getDayInTimezone(session.startTime, timezone);
      const hour = getHourInTimezone(session.startTime, timezone);
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
        error: "Failed to fetch session heatmap data"
      }), 
      { status: 500 }
    );
  }
}

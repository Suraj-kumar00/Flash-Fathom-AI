
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const dateRange = searchParams.get("dateRange");

  const studySessions = await prisma.studySession.findMany({
    where: {
      userId: user.id,
      startTime: dateRange ? { gte: new Date(dateRange) } : undefined,
      records: subject
        ? {
            some: {
              flashcard: {
                deck: { name: subject },
              },
            },
          }
        : undefined,
    },
    include: { records: true },
  });

  const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));

  studySessions.forEach((session) => {
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
}

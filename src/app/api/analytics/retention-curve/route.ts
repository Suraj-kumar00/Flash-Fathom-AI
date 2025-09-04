
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
  const difficulty = searchParams.get("difficulty");

  const studyRecords = await prisma.studyRecord.findMany({
    where: {
      flashcard: {
        userId: user.id,
        deck: subject ? { name: subject } : undefined,
        difficulty: difficulty ? { equals: difficulty as any } : undefined,
      },
      createdAt: dateRange ? { gte: new Date(dateRange) } : undefined,
    },
    orderBy: { createdAt: "asc" },
  });

  const retentionData = studyRecords.reduce((acc, record) => {
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
  const retention = Object.values(retentionData).map((d) => (d.correct / d.total) * 100);

  return new NextResponse(JSON.stringify({ labels, retention }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

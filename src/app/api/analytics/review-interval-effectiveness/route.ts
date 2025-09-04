import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const dateRange = searchParams.get('dateRange');

  try {
    const studyRecords = await prisma.studyRecord.findMany({
      where: {
        flashcard: {
          userId: userId,
          ...(subject && { deck: { name: subject } }),
        },
        ...(dateRange && { createdAt: { gte: new Date(dateRange) } }),
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        flashcard: true,
      },
    });

    const recordsByFlashcard = studyRecords.reduce((acc, record) => {
      if (!acc[record.flashcardId]) {
        acc[record.flashcardId] = [];
      }
      acc[record.flashcardId].push(record);
      return acc;
    }, {} as Record<string, typeof studyRecords>);

    const reviewIntervals = Object.values(recordsByFlashcard).flatMap(records => {
        if (records.length < 2) {
            return [];
        }

        // Corrected logic: The 'index' in slice().map() is offset.
        return records.slice(1).map((record, index) => {
            // The previous record is at 'index' in the original 'records' array.
            const previousRecord = records[index];
            const interval = (new Date(record.createdAt).getTime() - new Date(previousRecord.createdAt).getTime()) / (1000 * 3600 * 24); // Interval in days
            return {
                interval,
                isCorrect: record.isCorrect,
            };
        });
    });

    return NextResponse.json(reviewIntervals);
  } catch (error) {
    console.error('[REVIEW_INTERVAL_API]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

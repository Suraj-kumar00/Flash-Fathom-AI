import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const dateRange = searchParams.get('dateRange');

  try {
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: userId,
        ...(dateRange && { startTime: { gte: new Date(dateRange) } }),
        ...(subject && {
          records: {
            some: {
              flashcard: {
                deck: { name: subject }
              }
            }
          }
        })
      },
      include: {
        records: true,
      },
    });

    const timeSpentData = studySessions.map(session => {
      const sessionDuration = session.endTime ? (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000 : 0; // Duration in minutes
      const totalCards = session.records.length;
      const averageTimePerCard = totalCards > 0 ? session.records.reduce((acc, record) => acc + record.timeSpent, 0) / totalCards : 0; // Average in seconds

      return {
        date: session.startTime,
        sessionDuration,
        averageTimePerCard,
      };
    });

    return NextResponse.json(timeSpentData);
  } catch (error) {
    console.error('[TIME_SPENT_API]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

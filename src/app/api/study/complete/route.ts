import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId, stats, duration } = await request.json();

    // Update study session with completion data
    await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        // Could add more session stats here
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Study session completed',
      stats: {
        duration: Math.floor(duration / 1000), // Convert to seconds
        ...stats
      }
    });

  } catch (error) {
    console.error('Error completing study session:', error);
    return NextResponse.json(
      { error: 'Failed to complete study session' },
      { status: 500 }
    );
  }
}

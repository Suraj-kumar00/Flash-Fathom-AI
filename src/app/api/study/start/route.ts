import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';
import { userService } from '@/lib/services/user.service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { deckId } = await request.json();

    if (!deckId) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
        { status: 400 }
      );
    }

    // Ensure user exists
    await userService.ensureUserExists(userId);

    // Create study session
    const studySession = await prisma.studySession.create({
      data: {
        userId,
        startTime: new Date(),
        // endTime will be set when session completes
      }
    });

    return NextResponse.json({
      sessionId: studySession.id,
      message: 'Study session started successfully'
    });

  } catch (error) {
    console.error('Error starting study session:', error);
    return NextResponse.json(
      { error: 'Failed to start study session' },
      { status: 500 }
    );
  }
}

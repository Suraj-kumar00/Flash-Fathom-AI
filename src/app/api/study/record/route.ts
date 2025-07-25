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

    const { sessionId, flashcardId, isCorrect, difficulty, timeSpent } = await request.json();

    // Record the study attempt
    await prisma.studyRecord.create({
      data: {
        sessionId,
        flashcardId,
        isCorrect,
        timeSpent: timeSpent || 0
      }
    });

    // Update flashcard difficulty and repetition count
    await prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        difficulty: difficulty,
        repetitions: { increment: 1 },
        lastReviewed: new Date(),
        // Simple spaced repetition: next review based on performance
        nextReview: new Date(Date.now() + getNextReviewInterval(isCorrect, difficulty))
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Study record saved successfully'
    });

  } catch (error) {
    console.error('Error recording study attempt:', error);
    return NextResponse.json(
      { error: 'Failed to record study attempt' },
      { status: 500 }
    );
  }
}

// Simple spaced repetition algorithm
function getNextReviewInterval(isCorrect: boolean, difficulty: string): number {
  const baseInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (!isCorrect) {
    return baseInterval * 0.5; // Review in 12 hours if incorrect
  }
  
  switch (difficulty) {
    case 'EASY':
      return baseInterval * 7; // 7 days
    case 'MEDIUM':
      return baseInterval * 3; // 3 days
    case 'HARD':
      return baseInterval * 1; // 1 day
    default:
      return baseInterval * 2; // 2 days
  }
}

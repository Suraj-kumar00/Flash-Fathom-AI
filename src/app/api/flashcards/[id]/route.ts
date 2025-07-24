import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const flashcards = await prisma.flashcard.findMany({
      where: {
        userId: userId,
        deckId: params.id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(flashcards);
    
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

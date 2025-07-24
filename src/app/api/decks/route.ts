import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' }, 
        { status: 401 }
      );
    }

    // Fetch user's decks with flashcard counts
    const decks = await prisma.deck.findMany({
      where: {
        userId: userId // This now uses clerkUserId thanks to our schema fix
      },
      include: {
        flashcards: {
          select: {
            id: true // Only select id for counting
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match expected format
    const formattedDecks = decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      flashcards: deck.flashcards // Include flashcard count
    }));

    return NextResponse.json(formattedDecks);
    
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

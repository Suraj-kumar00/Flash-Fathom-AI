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

    const { query, filters } = await request.json();

    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }

    // Ensure user exists
    await userService.ensureUserExists(userId);

    const results: any[] = [];

    // Search flashcards if enabled in filters
    if (filters.type.includes('flashcard')) {
      const flashcards = await prisma.flashcard.findMany({
        where: {
          userId,
          AND: [
            {
              OR: [
                { question: { contains: query, mode: 'insensitive' } },
                { answer: { contains: query, mode: 'insensitive' } }
              ]
            },
            // Apply difficulty filter if specified
            filters.difficulty.length > 0 ? {
              difficulty: { in: filters.difficulty }
            } : {},
          ]
        },
        include: {
          deck: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20 // Limit results
      });

      // Fix: Add explicit type annotation
      const flashcardResults = flashcards.map((card: any) => ({
        id: card.id,
        type: 'flashcard' as const,
        title: card.question,
        content: card.answer,
        deckName: card.deck.name || 'Untitled Deck',
        deckId: card.deckId,
        difficulty: card.difficulty,
        lastReviewed: card.lastReviewed?.toISOString(),
        createdAt: card.createdAt.toISOString()
      }));

      results.push(...flashcardResults);
    }

    // Search decks if enabled in filters
    if (filters.type.includes('deck')) {
      const decks = await prisma.deck.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          flashcards: {
            select: { id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // Fix: Add explicit type annotation  
      const deckResults = decks.map((deck: any) => ({
        id: deck.id,
        type: 'deck' as const,
        title: deck.name,
        content: deck.description || `${deck.flashcards.length} flashcards`,
        createdAt: deck.createdAt.toISOString()
      }));

      results.push(...deckResults);
    }

    // Sort all results by relevance (exact matches first, then by date)
    const sortedResults = results.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bExactMatch = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(sortedResults);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

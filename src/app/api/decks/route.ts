import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { flashcardService } from '@/lib/services/flashcard.service';

export async function GET(request: NextRequest) {
  try {
    // ✅ FIXED: Add await for Clerk v6
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' }, 
        { status: 401 }
      );
    }

    // ✅ CORRECT: Use service layer
    const decks = await flashcardService.getUserDecks(userId);
    return NextResponse.json(decks);
    
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

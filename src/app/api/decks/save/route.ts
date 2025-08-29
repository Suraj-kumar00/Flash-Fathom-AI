import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { flashcardService } from '@/lib/services/flashcard.service';
import type { 
  CreateFlashcardSetRequest, 
  CreateFlashcardSetResponse,
  ApiError 
} from '@/types';

const saveFlashcardsSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(100, 'Name too long'),
  flashcards: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required')
  })).min(1, 'At least one flashcard is required')
}) satisfies z.ZodType<CreateFlashcardSetRequest>;

export async function POST(request: NextRequest) {
  try {

    // ✅ FIXED: Add await for Clerk v6
    const { userId } = await auth();
    
    if (!userId) {
      const error: ApiError = { error: 'Unauthorized - Please sign in' };
      return NextResponse.json(error, { status: 401 });
    }


    const body = await request.json();
    console.log('📋 Request body:', { 
      name: body.name, 
      flashcardCount: body.flashcards?.length || 0 
    });

    const validatedData = saveFlashcardsSchema.parse(body);

    // ✅ CORRECT: Use service layer
    const result = await flashcardService.createDeckWithFlashcards(userId, validatedData);

    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error in POST /api/decks/save:', error);
    
    // Enhanced error reporting
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : String(error);
    
    console.error('❌ Full error details:', { errorMessage, errorStack });
    
    if (error instanceof z.ZodError) {
      console.log('❌ Validation error:', error.errors);
      const errorResponse: ApiError = {
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ApiError = { 
      error: 'Failed to save flashcards',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

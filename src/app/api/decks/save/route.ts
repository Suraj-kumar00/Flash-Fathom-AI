import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { flashcardService } from '@/lib/services/flashcard.service';
import type { 
  CreateFlashcardSetRequest, 
  CreateFlashcardSetResponse,
  ApiError 
} from '@/types';

// Input validation
const saveFlashcardsSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(100, 'Name too long'),
  flashcards: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required')
  })).min(1, 'At least one flashcard is required')
}) satisfies z.ZodType<CreateFlashcardSetRequest>;

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      const error: ApiError = { error: 'Unauthorized - Please sign in' };
      return NextResponse.json(error, { status: 401 });
    }

    const body = await request.json();
    const validatedData = saveFlashcardsSchema.parse(body);

    // Single Responsibility: Delegate to service
    const result = await flashcardService.createDeckWithFlashcards(userId, validatedData);

    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    console.error('Error saving flashcards:', error);
    
    if (error instanceof z.ZodError) {
      const errorResponse: ApiError = {
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ApiError = { error: 'Failed to save flashcards' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

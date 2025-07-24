import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { flashcardService } from "@/lib/services/flashcard.service";
import type { ApiError, FlashcardGenerationResponse } from "@/types";

export async function POST(req: Request) {
  try {
    // Authentication
    const { userId } = auth();
    if (!userId) {
      const error: ApiError = { error: "Unauthorized - Please sign in" };
      return NextResponse.json(error, { status: 401 });
    }

    // Input validation
    const text = await req.text();
    if (!text?.trim()) {
      const error: ApiError = { error: "Text content is required" };
      return NextResponse.json(error, { status: 400 });
    }

    // Single Responsibility: Delegate to service
    const flashcards = await flashcardService.generateFlashcards(text);

    const response: FlashcardGenerationResponse = { flashcards };
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error generating flashcards:", error);
    const errorResponse: ApiError = { 
      error: error instanceof Error ? error.message : "Failed to generate flashcards" 
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

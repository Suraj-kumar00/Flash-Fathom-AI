import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { flashcardService } from "@/lib/services/flashcard.service";
import { prisma } from "@/lib/database";
import { subscriptionService } from "@/lib/services/subscription.service";
import type { ApiError, FlashcardGenerationResponse } from "@/types";

export async function POST(req: Request) {
  try {
    // ✅ FIXED: Authentication with await for Clerk v6
    const { userId } = await auth();
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

    // Determine plan-based limits
    const status = await subscriptionService.getUserSubscriptionStatus(userId);
    // Monthly flashcard caps (per saved/generated content)
    const monthlyCaps: Record<string, number> = {
      free: 10,
      basic: 500,
      pro: 2000,
      orgs: 10000,
    };
    const planKey = status.plan?.toLowerCase?.() || 'free';
    const monthlyCap = monthlyCaps[planKey] ?? 10;

    // Calculate current month's usage based on saved flashcards
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));

    const usedThisMonth = await prisma.flashcard.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    const remainingThisMonth = Math.max(0, monthlyCap - usedThisMonth);
    if (remainingThisMonth <= 0) {
      const error: ApiError = { 
        error: "Monthly limit reached",
        details: `You've reached your monthly limit of ${monthlyCap} flashcards for the ${planKey} plan.`
      };
      return NextResponse.json(error, { status: 403 });
    }

    // Always generate at most 10 at a time, and never exceed remaining monthly allowance
    const PER_REQUEST_CAP = 10;
    const desiredCount = Math.min(PER_REQUEST_CAP, remainingThisMonth);

    // ✅ CORRECT: Single Responsibility - Delegate to service with count
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

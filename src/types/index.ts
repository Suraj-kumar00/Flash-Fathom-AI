// ===== SITE CONFIGURATION (from existing types.d.ts) =====
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
    portfolio: string;
  };
};

// ===== PRISMA GENERATED TYPES (Primary source of truth) =====
import type { 
  User as PrismaUser,
  Deck as PrismaDeck,
  Flashcard as PrismaFlashcard,
  Difficulty,
  StudySession,
  StudyRecord
} from '@prisma/client';

// Re-export Prisma types as main types
export type User = PrismaUser;
export type Flashcard = PrismaFlashcard;
export type { Difficulty, StudySession, StudyRecord };

// ===== DECK TYPES (Use your existing interface that components expect) =====
// Keep your current Deck interface since components use it
export interface Deck {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  flashcards: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

// Extended Deck with full Prisma flashcards
export interface DeckWithFlashcards extends PrismaDeck {
  flashcards: PrismaFlashcard[];
}

// ===== FORM INPUT TYPES (from existing types.d.ts) =====
export interface FlashcardInput {
  question: string;
  answer: string;
}

export interface SaveFlashcardInput {
  question: string;
  answer: string;
  userId: string;
  deckId: string;
}

export interface FlashcardFormData {
  text: string;
}

export interface DeckNameFormData {
  name: string;
}

// ===== API REQUEST/RESPONSE TYPES =====
export interface CreateFlashcardSetRequest {
  name: string;
  flashcards: FlashcardInput[];
}

export interface CreateFlashcardSetResponse {
  id: string;
  name: string;
  flashcards: PrismaFlashcard[];
  message: string;
}

export interface FlashcardGenerationResponse {
  flashcards: FlashcardInput[];
}

// ===== RAZORPAY PAYMENT TYPES =====
export type SubscriptionPlan = 'Free' | 'Pro' | 'Organizational';
export type BillingCycle = 'monthly' | 'yearly';

export interface RazorpayOrderRequest {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
}

// ===== COMPONENT PROPS TYPES =====
export interface FlashcardComponentProps {
  flashcards: PrismaFlashcard[];
}

export interface DeckCardProps {
  deck: Deck;
  onDelete?: (deckId: string) => void;
}

// ===== API ERROR HANDLING =====
export interface ApiError {
  error: string;
  details?: string | Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// ===== UTILITY TYPES =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ===== THEME TYPES =====
export type Theme = 'light' | 'dark' | 'system';

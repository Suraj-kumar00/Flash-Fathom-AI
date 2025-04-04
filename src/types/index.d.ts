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
  interface FlashcardSet {
    setId: string;
    setName: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface Flashcard {
    flashcardId: string;
    setId: string;
    question: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Grouping flashcards with their set
  export type FlashcardSetWithCards = {
    setName: string;
    userId: string;
    flashcards: Flashcard[];
  };
  
  export type { FlashcardSet, Flashcard, FlashcardSetWithCards };

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
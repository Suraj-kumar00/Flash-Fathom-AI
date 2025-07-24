import { prisma } from '@/lib/database';
import type { 
  Flashcard, 
  CreateFlashcardSetRequest, 
  CreateFlashcardSetResponse,
  DeckWithFlashcards 
} from '@/types';

export class FlashcardService {
  /**
   * Single Responsibility: Handle flashcard generation
   */
  async generateFlashcards(text: string): Promise<{ question: string; answer: string }[]> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Create 10 flashcards from this text: "${text}". 
        Each flashcard should have a question and answer. 
        Format your response as a JSON array like this:
        {
          "flashcards": [
            {"question": "What is X?", "answer": "X is Y"},
            // more cards...
          ]
        }`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error("Invalid response format from Gemini API");
      }

      // Clean JSON response
      content = content.replace(/``````/g, "").trim();
      const parsed = JSON.parse(content);
      
      return parsed.flashcards || [];
    } catch (error) {
      console.error('Flashcard generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }

  /**
   * Single Responsibility: Handle deck operations
   */
  async createDeckWithFlashcards(
    userId: string, 
    request: CreateFlashcardSetRequest
  ): Promise<CreateFlashcardSetResponse> {
    const deck = await prisma.deck.create({
      data: {
        name: request.name,
        userId: userId,
        flashcards: {
          create: request.flashcards.map(card => ({
            question: card.question,
            answer: card.answer,
            userId: userId
          }))
        }
      },
      include: {
        flashcards: true
      }
    });

    return {
      id: deck.id,
      name: deck.name,
      flashcards: deck.flashcards,
      message: 'Flashcards saved successfully'
    };
  }

  /**
   * Single Responsibility: Fetch user's decks
   */
  async getUserDecks(userId: string): Promise<DeckWithFlashcards[]> {
    return await prisma.deck.findMany({
      where: { userId },
      include: {
        flashcards: {
          select: { id: true, question: true, answer: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Single Responsibility: Fetch flashcards for a deck
   */
  async getDeckFlashcards(userId: string, deckId: string): Promise<Flashcard[]> {
    return await prisma.flashcard.findMany({
      where: {
        userId: userId,
        deckId: deckId
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Single Responsibility: Delete a deck
   */
  async deleteDeck(userId: string, deckId: string): Promise<void> {
    await prisma.deck.delete({
      where: {
        id: deckId,
        userId: userId
      }
    });
  }
}

// Singleton instance
export const flashcardService = new FlashcardService();

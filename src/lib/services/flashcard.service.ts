import { prisma } from '@/lib/database';
import { userService } from './user.service'; // ✅ ONLY ADDITION: Import UserService
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
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Create 10 flashcards from this text: "${text}". 
        Each flashcard should have a question and answer. 
        Format your response as a JSON array like this (return ONLY the JSON, no markdown or code blocks):
        {
          "flashcards": [
            {"question": "What is X?", "answer": "X is Y"},
            {"question": "Define Z", "answer": "Z means..."}
          ]
        }
        
        IMPORTANT: Return ONLY valid JSON without any markdown formatting, backticks, or code block syntax.`;

    try {
      console.log('🤖 Calling Gemini API for flashcard generation...');

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
        console.error('❌ Gemini API error:', response.status, response.statusText);
        throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📡 Gemini API response received');

      let content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        console.error('❌ Invalid response format from Gemini API:', data);
        throw new Error("Invalid response format from Gemini API");
      }

      

      // ✅ FIXED: Properly terminated regex patterns
      content = content
        .replace(/```json\s*/g, '')         // Remove ```json markers
        .replace(/```\s*/g, '')             // Remove ``` markers
        .replace(/``````json\s*/g, '')      // Remove 6-backtick json markers
        .replace(/``````\s*/g, '')          // Remove 6-backtick variations with whitespace
        .trim();


      // Additional cleanup for any remaining markdown artifacts
      if (content.startsWith('json\n')) {
        content = content.substring(5);
      }
      if (content.startsWith('json ')) {
        content = content.substring(5);
      }


      console.log('🧹 Cleaned content for parsing:', content);

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Problematic content:', content);
        
        // Try to extract JSON from the content if it's embedded
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully extracted JSON from embedded content');
          } catch (secondParseError) {
            console.error('❌ Second JSON parse attempt failed:', secondParseError);
            throw new Error("Failed to parse AI response as JSON even after content extraction");
          }
        } else {
          throw new Error("No valid JSON found in AI response");
        }
      }
      
      const flashcards = parsed.flashcards || [];
      
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("No valid flashcards generated from the provided text");
      }

      // Validate flashcard structure
      const validFlashcards = flashcards.filter(card => 
        card && 
        typeof card === 'object' && 
        typeof card.question === 'string' && 
        typeof card.answer === 'string' &&
        card.question.trim() !== '' &&
        card.answer.trim() !== ''
      );

      if (validFlashcards.length === 0) {
        throw new Error("No valid flashcards found in AI response");
      }

      console.log(`✅ Successfully generated ${validFlashcards.length} valid flashcards`);
      return validFlashcards;
      
    } catch (error) {
      console.error('❌ Flashcard generation error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error('Network error: Unable to connect to AI service. Please check your internet connection.');
        } else if (error.message.includes('JSON')) {
          throw new Error('AI response format error: The AI returned an invalid response. Please try again.');
        } else if (error.message.includes('API error')) {
          throw new Error('AI service error: The AI service is temporarily unavailable. Please try again later.');
        }
        throw error;
      }
      
      throw new Error('Failed to generate flashcards. Please try again.');
    }
  }

  /**
   * Single Responsibility: Handle deck operations
   */
  async createDeckWithFlashcards(
    userId: string, 
    request: CreateFlashcardSetRequest
  ): Promise<CreateFlashcardSetResponse> {
    try {
      console.log(`💾 Creating deck "${request.name}" with ${request.flashcards.length} flashcards for user: ${userId}`);

      // ✅ ONLY ADDITION: Ensure user exists with real Clerk data
      await userService.ensureUserExists(userId);

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

      console.log(`✅ Successfully created deck with ID: ${deck.id}`);

      return {
        id: deck.id,
        name: deck.name,
        flashcards: deck.flashcards,
        message: 'Flashcards saved successfully'
      };
    } catch (error) {
      console.error('❌ Error creating deck with flashcards:', error);
      
      // ✅ ONLY ADDITION: Enhanced error handling for Clerk issues
      if (error instanceof Error) {
        if (error.message.includes('Foreign key constraint') || error.message.includes('P2003')) {
          throw new Error('Failed to verify user account with Clerk. Please sign in again and try.');
        } else if (error.message.includes('Failed to fetch user data from Clerk')) {
          throw new Error('Authentication error: Unable to verify your account. Please sign in again.');
        } else if (error.message.includes('Clerk')) {
          throw new Error(`Authentication error: ${error.message}`);
        }
      }
      
      throw new Error('Failed to save flashcards to database');
    }
  }

  /**
   * Single Responsibility: Fetch user's decks
   */
  async getUserDecks(userId: string): Promise<DeckWithFlashcards[]> {
    try {
      console.log(`📚 Fetching decks for user: ${userId}`);

      // ✅ ONLY ADDITION: Ensure user exists
      await userService.ensureUserExists(userId);

      const decks = await prisma.deck.findMany({
        where: { userId },
        include: {
          flashcards: true // Include all flashcard fields
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`✅ Found ${decks.length} decks for user`);
      return decks;
    } catch (error) {
      console.error('❌ Error fetching user decks:', error);
      
      // ✅ ONLY ADDITION: Enhanced error handling for Clerk issues
      if (error instanceof Error && error.message.includes('Clerk')) {
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      throw new Error('Failed to fetch user decks');
    }
  }

  /**
   * Single Responsibility: Fetch flashcards for a deck
   */
  async getDeckFlashcards(userId: string, deckId: string): Promise<Flashcard[]> {
    try {
      console.log(`🃏 Fetching flashcards for deck: ${deckId}, user: ${userId}`);

      // ✅ ONLY ADDITION: Ensure user exists
      await userService.ensureUserExists(userId);

      const flashcards = await prisma.flashcard.findMany({
        where: {
          userId: userId,
          deckId: deckId
        },
        orderBy: { createdAt: 'asc' }
      });

      console.log(`✅ Found ${flashcards.length} flashcards in deck`);
      return flashcards;
    } catch (error) {
      console.error('❌ Error fetching deck flashcards:', error);
      
      // ✅ ONLY ADDITION: Enhanced error handling for Clerk issues
      if (error instanceof Error && error.message.includes('Clerk')) {
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      throw new Error('Failed to fetch flashcards');
    }
  }

  /**
   * Single Responsibility: Delete a deck
   */
  async deleteDeck(userId: string, deckId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting deck: ${deckId} for user: ${userId}`);

      // ✅ ONLY ADDITION: Ensure user exists
      await userService.ensureUserExists(userId);

      await prisma.deck.delete({
        where: {
          id: deckId,
          userId: userId
        }
      });

      console.log(`✅ Successfully deleted deck: ${deckId}`);
    } catch (error) {
      console.error('❌ Error deleting deck:', error);
      
      // ✅ ONLY ADDITION: Enhanced error handling for Clerk issues
      if (error instanceof Error && error.message.includes('Clerk')) {
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      throw new Error('Failed to delete deck');
    }
  }
}

// Singleton instance
export const flashcardService = new FlashcardService();

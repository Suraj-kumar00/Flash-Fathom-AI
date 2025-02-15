// import { Flashcard } from "@/types";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.SUPABASE_URL || "",
//   process.env.SUPABASE_ANON_KEY || ""
// );

// export const saveFlashcardSetToSupabase = async (
//   userId: string,
//   setName: string,
//   flashcards: Flashcard[]
// ) => {
//   const { data, error } = await supabase.from("flashcards").insert(
//     flashcards.map((flashcard) => ({
//       user_id: userId,
//       set_name: setName,
//       question: flashcard.question,
//       answer: flashcard.answer,
//       created_at: flashcard.createdAt,
//       updated_at: flashcard.updatedAt,
//     }))
//   );

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function saveFlashcardsToSupabase(
  userId: string,
  deckId: string,
  flashcards: Array<{ question: string; answer: string }>
) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(
        flashcards.map((card) => ({
          user_id: userId,
          deck_id: deckId,
          question: card.question,
          answer: card.answer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving flashcards to Supabase:', error)
    throw error
  }
}

export default supabase;

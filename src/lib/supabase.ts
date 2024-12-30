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

import { Flashcard } from "@/types";
import { createClient } from "@supabase/supabase-js";

// Load the Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required!");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveFlashcardSetToSupabase = async (
  userId: string,
  setName: string,
  flashcards: Flashcard[]
) => {
  try {
    // Insert flashcards into the "flashcards" table
    const { data, error } = await supabase
      .from("flashcards")
      .insert(
        flashcards.map((flashcard) => ({
          user_id: userId,
          set_name: setName,
          question: flashcard.question,
          answer: flashcard.answer,
          created_at: flashcard.createdAt,
          updated_at: flashcard.updatedAt,
        }))
      )
      .select(); // Ensure you get the data back (if needed)

    // Error handling: throw an error if insertion fails
    if (error) {
      throw new Error(error.message);
    }

    // Return the successfully inserted data
    return data;
  } catch (err: unknown) {
    // Catch any other errors
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Error saving flashcards:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default supabase;

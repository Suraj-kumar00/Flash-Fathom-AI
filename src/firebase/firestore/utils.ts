//import { db } from "../config";
import { initializeFirebase } from "../config";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { Flashcard, FlashcardSet } from "@/types";

const COLLECTION_NAME = "flashcardSets";

export const saveFlashcardSet = async (
  userId: string,
  setName: string,
  flashcards: Flashcard[],
): Promise<string> => {
  try {
    const db = await initializeFirebase();
    const flashcardSetRef = doc(
      collection(db, `users/${userId}/flashcardSets`),
    );

    const now = new Date();

    const batch = writeBatch(db);

    // Set flashcard set document with auto-generated ID
    batch.set(flashcardSetRef, {
      setName,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    // Add flashcards to a subcollection
    flashcards.forEach((flashcard) => {
      const flashcardRef = doc(collection(flashcardSetRef, "flashcards"));
      batch.set(flashcardRef, {
        ...flashcard,
        setId: flashcardSetRef.id,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();
    console.log("Flashcards saved successfully!");
    return flashcardSetRef.id; // Return the auto-generated ID
  } catch (error) {
    console.error("Error saving flashcards:", error);
    throw new Error("An error occurred while saving flashcards.");
  }
};


export const fetchUserFlashcardSets = async (
  userId: string,
): Promise<FlashcardSet[]> => {
  try {
    const db = await initializeFirebase();
    const setsRef = collection(db, `users/${userId}/flashcardSets`);
    const snapshot = await getDocs(setsRef);
    const sets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        setId: doc.id,
        setName: data.setName || "",
        userId: userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FlashcardSet;
    });
    return sets;
  } catch (error) {
    console.error("Error fetching flashcard sets:", error);
    throw new Error("Failed to fetch flashcard sets.");
  }
};

export async function fetchFlashcardsBySet(
  userId: string,
  setId: string,
): Promise<Flashcard[]> {
  try {
    const db = await initializeFirebase();
    const flashcardsCollectionRef = collection(
      db,
      "users",
      userId,
      "flashcardSets",
      setId,
      "flashcards",
    );
    const q = query(flashcardsCollectionRef);

    const querySnapshot = await getDocs(q);
    const flashcards: Flashcard[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const flashcard: Flashcard = {
        flashcardId: doc.id,
        setId: setId,
        question: data.question,
        answer: data.answer,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
      flashcards.push(flashcard);
    });

    return flashcards;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw error;
  }
}

export const deleteFlashcardSet = async (userId: string, setId: string) => {
  try {
    const db = await initializeFirebase();
    const batch = writeBatch(db);
    const flashcardSetRef = doc(db, `users/${userId}/flashcardSets/${setId}`);

    // Get all flashcards in the set
    const flashcardsCollectionRef = collection(flashcardSetRef, "flashcards");
    const flashcardsSnapshot = await getDocs(flashcardsCollectionRef);

    // Delete each flashcard
    flashcardsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the flashcard set
    batch.delete(flashcardSetRef);

    await batch.commit();
    console.log("Flashcard set and its flashcards deleted successfully!");
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    throw new Error("An error occurred while deleting the flashcard set.");
  }
};

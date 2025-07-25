"use client";

import { useState } from "react";
import DeckCard from "./DeckCard";
import { useToast } from "@/components/ui/use-toast";
import type { Deck } from "@/types";

// Single Responsibility: Manage list of decks
interface DeckListProps {
  decks: Deck[];
  onDeckDeleted?: (deckId: string) => void;
}

export default function DeckList({ decks, onDeckDeleted }: DeckListProps) {
  const [deletingDeck, setDeletingDeck] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteDeck = async (deckId: string) => {
    if (deletingDeck) return; // Prevent multiple deletions

    setDeletingDeck(deckId);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete deck');
      }

      toast({
        title: "Success",
        description: "Deck deleted successfully",
      });

      if (onDeckDeleted) {
        onDeckDeleted(deckId);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete deck. Please try again.",
      });
    } finally {
      setDeletingDeck(null);
    }
  };

  if (decks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          No flashcards yet. Create your first set!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onDelete={handleDeleteDeck}
        />
      ))}
    </div>
  );
}

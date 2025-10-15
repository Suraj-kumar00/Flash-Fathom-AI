"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import DeckList from "@/components/decks/DeckList";
import type { Deck } from "@/types";
import  GlobalSearch  from '@/components/search/GlobalSearch'
import { useSubscription } from "@/hooks/useSubscription";

// Single Responsibility: Manage flashcards overview page
export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoaded } = useUser();
  const { canAccessPro } = useSubscription();

  useEffect(() => {
    const fetchDecks = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/decks?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch decks');
        }
        const data = await response.json();
        setDecks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setDecks([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchDecks();
    }
  }, [user, isLoaded]);

  const handleDeckDeleted = (deckId: string) => {
    setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Please sign in to view your flashcards
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <GlobalSearch />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Flashcards</h1>
        <Link href={canAccessPro ? "/generate-pro" : "/generate"}>
          <Button size="icon" className="bg-purple-600 h-10 w-32 hover:bg-purple-500">
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </div>
      
      <DeckList decks={decks} onDeckDeleted={handleDeckDeleted} />
    </div>
  );
}

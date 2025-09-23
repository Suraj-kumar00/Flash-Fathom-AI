"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, BarChart2 } from "lucide-react";
import DeckList from "@/components/decks/DeckList";
import type { Deck } from "@/types";
import  GlobalSearch  from '@/components/search/GlobalSearch'

// Disable static generation for this page since it uses Clerk
export const dynamic = 'force-dynamic';

// Single Responsibility: Manage flashcards overview page
export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoaded } = useUser();

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
        <div className="flex gap-2">
          <Button asChild size="icon" className="bg-purple-600 hover:bg-purple-500">
            <Link href="/generate" aria-label="Create flashcard">
              <Plus className="h-7 w-7" />
            </Link>
          </Button>
          <Button asChild size="icon" className="bg-blue-600 hover:bg-blue-500">
            <Link href="/analytics" aria-label="View analytics">
              <BarChart2 className="h-7 w-7" />
            </Link>
          </Button>
        </div>
      </div>
      
      <DeckList decks={decks} onDeckDeleted={handleDeckDeleted} />
    </div>
  );
}

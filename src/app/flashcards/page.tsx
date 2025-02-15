"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Deck } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

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
        <h1 className="text-3xl font-bold mb-6">Please sign in to view your flashcards</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Flashcards</h1>
        <Link href="/generate">
          <Button size="icon" className="bg-purple-600 h-10 w-32 hover:bg-purple-500">
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </div>
      {decks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No flashcards yet. Create your first set!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {decks.map((deck) => (
            <li key={deck.id}>
              <Link href={`/flashcards/${deck.id}`}>
                <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out">
                  <CardContent className="p-4">
                    <p className="text-xl text-primary">{deck.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created: {new Date(deck.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cards: {deck.flashcards?.length || 0}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import type { FlashcardSet } from "@/types"; // Ensure you have a TypeScript type for FlashcardSet
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

// Initialize Prisma Client
const prisma = new PrismaClient();

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual userId (e.g., from session or context)
        const userId = "user-id";

        // Fetch FlashcardSets from PostgreSQL using Prisma
        const sets = await prisma.flashcardSet.findMany({
          where: { userId },
          include: {
            flashcards: true, // Include associated flashcards
          },
        });

        setFlashcardSets(sets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Flashcards </h1>
        <Link href="/generate">
          <Button
            size="icon"
            className="bg-purple-600 h-10 w-32 hover:bg-purple-500"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </div>
      <ul className="space-y-4">
        {flashcardSets.map((set) => (
          <li key={set.setId}>
            <Link href={`/flashcards/${set.setId}`}>
              <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out">
                <CardContent className="p-4">
                  <p className="text-xl text-primary">{set.setName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created: {new Date(set.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

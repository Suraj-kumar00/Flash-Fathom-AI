"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { DeckCardProps } from "@/types";

// Single Responsibility: Display a single deck card
export default function DeckCard({ deck, onDelete }: DeckCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    if (onDelete) {
      onDelete(deck.id);
    }
  };

  return (
    <div className="relative group">
      <Link href={`/flashcards/${deck.id}`}>
        <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xl text-primary font-medium">{deck.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Created: {new Date(deck.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Cards: {deck.flashcards?.length || 0}
                </p>
              </div>
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete deck"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

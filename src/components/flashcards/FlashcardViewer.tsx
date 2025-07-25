"use client";

import { useState, useEffect, useCallback } from "react"; // ✅ ADDED: useCallback import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";
import type { Flashcard } from "@/types";

// Single Responsibility: Only handle flashcard viewing and navigation
interface FlashcardViewerProps {
  flashcards: Array<{ question: string; answer: string }>;
  title?: string;
  showNavigation?: boolean;
}

export default function FlashcardViewer({ 
  flashcards, 
  title = "Flashcards",
  showNavigation = true 
}: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  // ✅ FIXED: Wrap event handlers in useCallback with proper dependencies
  const handleFlip = useCallback(() => setFlip(!flip), [flip]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlip(false);
  }, [flashcards.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setFlip(false);
  }, [flashcards.length]);

  // ✅ FIXED: Keyboard navigation with proper dependencies
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleFlip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious]); // ✅ ADDED: Dependencies

  const currentCard = flashcards[currentIndex];

  if (!currentCard) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No flashcards available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </CardHeader>
      <CardContent>
        <Card className="bg-secondary">
          <CardContent className="p-6 h-64 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {currentCard.question}
            </h2>
            {flip && (
              <p className="text-muted-foreground mx-auto text-lg text-center">
                {currentCard.answer}
              </p>
            )}
          </CardContent>
        </Card>
        
        {showNavigation && (
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleFlip}
              variant="ghost"
              size="icon"
              aria-label="Flip card"
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                aria-label="Previous card"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                aria-label="Next card"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

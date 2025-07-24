"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";
import FlashcardViewer from "@/components/flashcards/FlashcardViewer";
import FlashcardSaveDialog from "@/components/flashcards/FlashcardSaveDialog";
import type { FlashcardInput } from "@/types";

// Single Responsibility: Orchestrate flashcard workflow
export default function Flashcard() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState<FlashcardInput[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardInput[]) => {
    setFlashcards(newFlashcards);
  };

  const handleSaveSuccess = () => {
    // Could redirect to flashcards page or show success state
    setFlashcards([]); // Clear current flashcards
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-10">
      <Card className="w-full lg:max-w-[70vw]">
        <CardHeader>
          <CardTitle>Flashcard Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Generate Flashcards */}
          <FlashcardGenerator 
            onFlashcardsGenerated={handleFlashcardsGenerated}
          />

          {/* Step 2: Preview Generated Flashcards */}
          {flashcards.length > 0 && (
            <>
              <FlashcardViewer 
                flashcards={flashcards} 
                title="Generated Flashcards"
              />
              
              {/* Step 3: Save Flashcards */}
              {user && (
                <div className="space-y-4">
                  <Button
                    onClick={() => setSaveDialogOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-500"
                  >
                    Save Flashcards
                  </Button>

                  <FlashcardSaveDialog
                    flashcards={flashcards}
                    isOpen={saveDialogOpen}
                    onClose={() => setSaveDialogOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                  />
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <Link href="/flashcards">
            <Button variant="outline" className="w-full">
              View Saved Flashcards
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

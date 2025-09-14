"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";
import FlashcardViewer from "@/components/flashcards/FlashcardViewer";
import FlashcardSaveDialog from "@/components/flashcards/FlashcardSaveDialog";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { FlashcardInput } from "@/types";

export default function Flashcard() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useLocalStorage<FlashcardInput[]>('draft-flashcards', []);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardInput[]) => {
    setFlashcards(newFlashcards);
  };

  const handleSaveSuccess = () => {
    setFlashcards([]); // Clear draft after successful save
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-10">
      <Card className="w-full lg:max-w-[70vw]">
        <CardHeader>
          <CardTitle>Flashcard Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBoundary>
            <FlashcardGenerator 
              onFlashcardsGenerated={handleFlashcardsGenerated}
            />
          </ErrorBoundary>

          {flashcards.length > 0 && (
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner text="Loading flashcards..." />}>
                <FlashcardViewer 
                  flashcards={flashcards} 
                  title="Generated Flashcards"
                />
              </Suspense>
              
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
            </ErrorBoundary>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/flashcards">
                View Saved Flashcards
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              <Link href="/analytics">
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

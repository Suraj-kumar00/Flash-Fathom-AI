"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";
import FlashcardViewer from "@/components/flashcards/FlashcardViewer";
import FlashcardSaveDialog from "@/components/flashcards/FlashcardSaveDialog";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Crown } from "lucide-react";
import type { FlashcardInput } from "@/types";

export default function FlashcardPro() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useLocalStorage<FlashcardInput[]>('draft-flashcards-pro', []);
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>Pro Flashcard Generator</span>
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              PRO
            </Badge>
          </div>
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
                    className="w-full bg-purple-600 hover:bg-purple-700"
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

          <Link href="/flashcards">
            <Button variant="outline" className="w-full mt-4">
              View Saved Flashcards
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

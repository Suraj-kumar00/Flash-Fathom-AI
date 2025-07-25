"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { FlashcardInput } from "@/types";

interface FlashcardSaveDialogProps {
  flashcards: FlashcardInput[];
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function FlashcardSaveDialog({
  flashcards,
  isOpen,
  onClose,
  onSaveSuccess
}: FlashcardSaveDialogProps) {
  const [deckName, setDeckName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!deckName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for your flashcard set.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/decks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deckName.trim(),
          flashcards: flashcards.map(card => ({
            question: card.question,
            answer: card.answer
          }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save flashcards');
      }

      toast({
        title: "Success",
        description: "Flashcards saved successfully!",
      });

      setDeckName("");
      onClose();
      onSaveSuccess();
      
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save flashcards",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDeckName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Flashcard Set</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deckName" className="text-right">
              Set Name
            </Label>
            <Input
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter a name for your flashcard set"
              disabled={isLoading}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSave}
            disabled={isLoading || !deckName.trim()}
            className="bg-purple-600 hover:bg-purple-500"
          >
            {isLoading ? "Saving..." : "Save Flashcards"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

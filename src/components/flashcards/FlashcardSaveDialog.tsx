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

    if (!flashcards || flashcards.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No flashcards to save. Please generate some flashcards first.",
      });
      return;
    }

    setIsLoading(true);
    console.log('💾 Starting flashcard save process...');
    
    try {
      const requestData = {
        name: deckName.trim(),
        flashcards: flashcards.map(card => ({
          question: card.question.trim(),
          answer: card.answer.trim()
        }))
      };

      console.log('📋 Saving flashcards:', {
        deckName: requestData.name,
        flashcardCount: requestData.flashcards.length
      });

      const response = await fetch('/api/decks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Save failed:', errorData);
        
        const errorMessage = errorData.error || `HTTP ${response.status}: Failed to save flashcards`;
        
        // Show specific error details if available
        if (errorData.details) {
          if (Array.isArray(errorData.details)) {
            const validationErrors = errorData.details
              .map((detail: any) => `${detail.field}: ${detail.message}`)
              .join(', ');
            throw new Error(`${errorMessage} (${validationErrors})`);
          } else if (typeof errorData.details === 'string') {
            throw new Error(`${errorMessage} (${errorData.details})`);
          }
          }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Flashcards saved successfully:', result);

      toast({
        title: "Success",
        description: `Flashcards saved successfully as "${deckName.trim()}"!`,
      });

      setDeckName("");
      onClose();
      onSaveSuccess();
      
    } catch (error) {
      console.error("❌ Error saving flashcards:", error);
      
      let errorMessage = "Failed to save flashcards";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide user-friendly messages for common errors
        if (error.message.includes('Unauthorized')) {
          errorMessage = "Please sign in to save flashcards";
        } else if (error.message.includes('Validation failed')) {
          errorMessage = "Invalid flashcard data. Please check your inputs.";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: errorMessage,
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

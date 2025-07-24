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

// Single Responsibility: Handle saving flashcards with name input
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
  const [saving, setSaving] = useState(false);
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

    setSaving(true);
    try {
      const response = await fetch('/api/decks/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setSaving(false);
    }
  };

  const handleClose = () => {
    setDeckName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Flashcard Set</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deckName">Set Name</Label>
            <Input
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter a name for your flashcard set"
              disabled={saving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !deckName.trim()}
            className="bg-purple-600 hover:bg-purple-500"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

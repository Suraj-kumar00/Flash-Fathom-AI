"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { saveFlashcardsToSupabase } from "@/lib/supabase";
import type { Flashcard } from "@/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const formSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Text is required" })
    .max(500, { message: "Text must be 500 characters or less" }),
});

export default function Flashcard() {
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flip, setFlip] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveSuccessDialogOpen, setSaveSuccessDialogOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = "/flashcards";
    }
  }, [shouldRedirect]);

  // Key Events
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === " " || event.key === "Enter") {
        handleFlip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSet = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to save flashcards.",
      });
      return;
    }

    if (!setName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for your flashcard set.",
      });
      return;
    }

    try {
      const response = await fetch('/api/decks/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: setName,
          flashcards: flashcards.map(card => ({
            question: card.question,
            answer: card.answer
          }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save flashcards');
      }

      const deck = await response.json();

      // Save to Supabase as backup
      await saveFlashcardsToSupabase(
        user.id,
        deck.id,
        flashcards.map(card => ({
          question: card.question,
          answer: card.answer
        }))
      );

      setDialogOpen(false);
      setSaveSuccessDialogOpen(true);
      
      toast({
        title: "Success",
        description: "Flashcards saved successfully!",
      });

      setSetName("");
      
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save flashcards",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function handleFlip() {
    setFlip(!flip);
  }

  function handleNext() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlip(false);
  }

  function handlePrevious() {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setFlip(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: values.text,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
        setCurrentIndex(0);
        setFlip(false);
      } else {
        throw new Error("Invalid flashcards data received");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating flashcards.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Try again
          </ToastAction>
        ),
      });
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-10 ">
      <Card className="w-full lg:max-w-[70vw] ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Flashcard App</CardTitle>
          {currentCard && (
            <p className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Card className="bg-secondary">
            <CardContent className="p-4 md:p-6 h-64 flex flex-col justify-center items-center overflow-hidden">
              {currentCard ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    {currentCard.question}
                  </h2>
                  {flip && (
                    <p className="text-muted-foreground mx-auto text-lg text-center">
                      {currentCard.answer}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-center">
                  No flashcards generated yet. Enter text and click
                  &quot;Generate Flashcards&quot;.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleFlip}
              variant="ghost"
              size="icon"
              disabled={!currentCard}
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
            <div>
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                disabled={!currentCard}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                disabled={!currentCard}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 mb-4 space-y-2"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="text">Enter text:</Label>
                    <FormControl className="border-purple-600">
                      <Textarea
                        id="text"
                        placeholder="Enter text to generate flashcards"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-purple-700 dark:text-white hover:bg-purple-500"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Flashcards"}
              </Button>
            </form>
          </Form>
          {flashcards.length > 0 && (
            <div className="mt-4 space-y-4">
              <Button
                onClick={() => setDialogOpen(true)}
                className="w-full bg-purple-600 hover:bg-purple-500"
              >
                Save Flashcards
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Flashcard Set</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Set Name</Label>
                      <Input
                        id="name"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                        placeholder="Enter a name for your flashcard set"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSaveSet}
                      className="bg-purple-600 hover:bg-purple-500"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={saveSuccessDialogOpen} onOpenChange={setSaveSuccessDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Success!</DialogTitle>
                  </DialogHeader>
                  <p>Your flashcards have been saved successfully.</p>
                  <DialogFooter>
                    <Button onClick={() => window.location.href = '/flashcards'}>
                      View My Flashcards
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          <Link href="/flashcards">
            <Button variant="outline" className="mt-4 w-full">
              View Saved Flashcards
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

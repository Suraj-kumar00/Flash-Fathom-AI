"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import type { FlashcardFormData } from "@/types";

// Single Responsibility: Only handle flashcard generation form
interface FlashcardGeneratorProps {
  onFlashcardsGenerated: (flashcards: Array<{ question: string; answer: string }>) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Text is required" })
    .max(500, { message: "Text must be 500 characters or less" }),
});

export default function FlashcardGenerator({ 
  onFlashcardsGenerated, 
  isLoading = false 
}: FlashcardGeneratorProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true);
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
        onFlashcardsGenerated(data.flashcards);
      } else {
        throw new Error("Invalid flashcards data received");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was a problem generating flashcards. Please try again.",
      });
      console.error("Error generating flashcards:", error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text">Enter text to generate flashcards:</Label>
              <FormControl>
                <Textarea
                  id="text"
                  placeholder="Enter text to generate flashcards from..."
                  {...field}
                  rows={4}
                  className="border-purple-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-purple-700 dark:text-white hover:bg-purple-500"
          disabled={generating || isLoading}
        >
          {generating ? "Generating..." : "Generate Flashcards"}
        </Button>
      </form>
    </Form>
  );
}

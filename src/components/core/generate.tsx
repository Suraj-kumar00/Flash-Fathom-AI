'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

const FormSchema = z.object({
    text: z
        .string()
        .min(1, {
            message: "Please enter some text to generate flashcards.",
        })
        .max(500, {
            message: "Text must not be longer than 500 characters.",
        }),
})

export default function Generate() {
    // const [flashcards, setFlashcards] = useState([])
    const [flashcards, setFlashcards] = useState<Array<{ question: string, answer: string }>>([])
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: data.text,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate flashcards');
            }


            const flashcardsData = await response.json()
            if (flashcardsData.flashcards && Array.isArray(flashcardsData.flashcards)) {
                setFlashcards(flashcardsData.flashcards)
            } else {
                throw new Error('Invalid flashcards data received')
            }

            setFlashcards(flashcardsData.flashcards);
            toast({
                title: "Flashcards generated successfully!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(flashcardsData, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error: Error | any) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
            // console.error('Error generating flashcards:', error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto mt-8">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter text</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter text to generate flashcards"
                                    //className="resize-none"
                                    {...field}
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" >
                    Generate Flashcards
                </Button>
            </form>

            {/* Render flashcards here */}
            {flashcards.length > 0 && (
                <div className="flex items-center flex-col justify-center space-y-2 max-w-5xl mx-auto mt-8">
                    {flashcards.map((flashcard, index) => (
                        <div key={index} className="p-4 ">
                            <p>Question: {flashcard.question}</p>
                            <p>Answer: {flashcard.answer}</p>
                        </div>
                    ))}
                </div>
            )}
        </Form>
    )
}
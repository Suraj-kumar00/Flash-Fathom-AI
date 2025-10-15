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
// import router from "next/router"

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
    const [flashcards, setFlashcards] = useState<Array<{ question: string, answer: string }>>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: data.text,
            });

            if (!response.ok) {
                let errorMessage = 'Failed to generate flashcards';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.details || errorData.error || errorMessage;
                } catch {}
                throw new Error(errorMessage);
            }

            const { flashcards: generated } = await response.json()
            if (generated && Array.isArray(generated)) {
                setFlashcards(generated)
            } else {
                throw new Error('Invalid flashcards data received')
            }
            toast({
                title: "Flashcards generated successfully!",
                description: `${generated.length} flashcards created.`,
            })
        } catch (error: Error | unknown) {
            console.error('Error generating flashcards:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'An unexpected error occurred',
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false)
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Generating...' : 'Generate Flashcards'}
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

            {/* <div className="flex justify-center mt-8">
                <Button 
                    className="w-full max-w-xs" 
                    onClick={() => router.push('/flashcards')}
                >
                    See your Flashcards
                </Button>
            </div> */}

        </Form>
    )
}
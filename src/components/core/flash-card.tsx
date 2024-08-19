'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ArrowRight, ArrowLeft } from "lucide-react"
import { SetStateAction, useEffect, useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { saveFlashcardSet } from "@/firebase/firestore/utils"
import type { Flashcard } from "@/types"

const formSchema = z.object({
    text: z.string().min(1, { message: "Text is required" }).max(500, { message: "Text must be 500 characters or less" }),
})

export default function Flashcard() {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [flip, setFlip] = useState<boolean>(false)
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const [setName, setSetName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    // Key Events    
    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            } else if (event.key === ' ' || event.key === 'Enter') {
                handleFlip();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    },);




    const handleSaveSet = async () => {
        try {
            // Assuming `flashcards` is an array of objects with `question` and `answer`
            const flashcardsWithIds: Flashcard[] = flashcards.map((flashcard, index) => ({
                ...flashcard,
                flashcardId: `flashcard-${index}`, // Generate a unique ID for each flashcard
                setId: 'set-id', // Replace with the actual set ID
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await saveFlashcardSet('user-id', setName, flashcardsWithIds); // Replace 'user-id' with actual user ID
            toast({
                variant: "default",
                title: "Success",
                description: "Flashcards saved successfully!",
                action: <ToastAction altText="View Sets"><a href="/flashcards">View Sets</a></ToastAction>,
            });
            handleCloseDialog();
            setSetName('');
            setFlashcards([]); // Clear the flashcards state if needed
        } catch (error) {
            console.error("Error saving flashcards:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "There was an error saving the flashcards.",
            });
        }
    };


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
        },
    })

    function handleFlip() {
        setFlip(!flip)
    }

    function handleNext() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
        setFlip(false)
    }

    function handlePrevious() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
        setFlip(false)
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
                    <ToastAction altText="Try again" onClick={() => form.handleSubmit(onSubmit)()}>
                        Try again
                    </ToastAction>
                ),
            });
            console.error('Error generating flashcards:', error);
        } finally {
            setLoading(false);
        }
    }

    const currentCard = flashcards[currentIndex]

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-3xl">
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
                        <CardContent className="p-6 h-64 flex flex-col justify-center items-center">
                            {currentCard ? (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">{currentCard.question}</h2>
                                    {flip && <p className="text-muted-foreground mx-auto text-lg">{currentCard.answer}</p>}
                                </>
                            ) : (
                                <p>No flashcards generated yet. Enter text and click &quot;Generate Flashcards&quot;.</p>
                            )}
                        </CardContent>
                    </Card>
                    <div className="flex justify-between mt-4">
                        <Button onClick={handleFlip} variant="ghost" size="icon" disabled={!currentCard}>
                            <RefreshCw className="h-6 w-6" />
                        </Button>
                        <div>
                            <Button onClick={handlePrevious} variant="ghost" size="icon" disabled={!currentCard}>
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                            <Button onClick={handleNext} variant="ghost" size="icon" disabled={!currentCard}>
                                <ArrowRight className="h-6 w-6" />
                            </Button>

                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 mb-4 space-y-2">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="text">Enter text:</Label>
                                        <FormControl>
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
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Flashcards'}
                            </Button>
                            {/* {currentCard && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        navigator.clipboard.writeText(currentCard.question)
                                    }}
                                >
                                    Copy Question
                                </Button>
                            )} */}

                        </form>
                    </Form>
                    {flashcards.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setDialogOpen(true)}
                            >
                                Save Set
                            </Button>

                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Save Flashcard Set</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Label htmlFor="setName">Set Name</Label>
                                        <Input
                                            id="setName"
                                            value={setName}
                                            onChange={(e: { target: { value: SetStateAction<string> } }) => setSetName(e.target.value)}
                                            placeholder="Enter flashcard set name"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSaveSet}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
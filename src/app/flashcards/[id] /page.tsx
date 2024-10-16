// app/flashcards/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { deleteFlashcardSet, fetchFlashcardsBySet } from '@/firebase/firestore/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ArrowRight, ArrowLeft, ChevronLeft, Loader2, Trash } from 'lucide-react';
import type { Flashcard } from '@/types';
import { useUser } from '@clerk/clerk-react';

export default function FlashcardSetPage() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [flip, setFlip] = useState<boolean>(false);
    const router = useRouter();
    const { id } = useParams();
    const { user, isLoaded } = useUser(); // Add isLoaded to check if user data is loaded

    useEffect(() => {
        if (id && isLoaded && user) {
            const fetchData = async () => {
                try {
                    const userId = user.id; // Get the actual userId from Clerk
                    const fetchedFlashcards = await fetchFlashcardsBySet(userId, id as string);
                    setFlashcards(fetchedFlashcards);
                } catch (error) {
                    console.error('Error fetching flashcards:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [id, isLoaded, user]);

    const currentCard = flashcards[currentIndex];

    const handleFlip = () => setFlip(!flip);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setFlip(false);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setFlip(false);
    };

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

    if (loading) return (
        <div className="min-h-screen flex justify-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    );

    const handleDeleteSet = async () => {
        try {
            if (isLoaded && user) {
                const userId = user.id; // Get the actual userId from Clerk
                await deleteFlashcardSet(userId, id as string);
                router.push('/flashcards'); // Redirect to flashcard sets page after deletion
            }
        } catch (error) {
            console.error('Error deleting flashcard set:', error);
        }
    };

    return (
        <div className="min-h-screen p-4 relative page-container">
            {/* Back button in top-left corner */}
            <Button
                variant="outline"
                onClick={() => router.push('/flashcards')}
                className="absolute top-4 left-4"
                size="icon"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="outline"
                onClick={handleDeleteSet}
                className="absolute top-4 right-4"
                size="icon"
            >
                {/* <span>Delete Set</span> */}
                <Trash className="h-6 w-6" />
            </Button>
            {flashcards.length > 0 ? (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <Card className="w-full max-w-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Flashcards</CardTitle>
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
                                        <p>No flashcards available.</p>
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
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <p>No flashcards found for this set.</p>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Flashcard } from '@/types';

interface FlashcardComponentProps {
    flashcards: Flashcard[];
}

export default function FlashcardComponent({ flashcards }: FlashcardComponentProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [flip, setFlip] = useState<boolean>(false);

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

    return (
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
                </CardContent>
            </Card>
        </div>
    );
}
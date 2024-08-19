'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchUserFlashcardSets } from '@/firebase/firestore/utils';
import type { FlashcardSet } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';


export default function FlashcardsPage() {
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with actual userId
                const userId = "user-id";
                const sets = await fetchUserFlashcardSets(userId);
                setFlashcardSets(sets);
            } catch (error) {
                console.error('Error fetching flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex justify-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Flashcard Sets</h1>
                <Link href="/generate">
                    <Button size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
            {/* overflow-y-auto custom-scrollbar */}
            <ul className="space-y-4">
                {flashcardSets.map((set) => (
                    <li key={set.setId}>
                        <Link href={`/flashcards/${set.setId}`}>
                            {/* className="hover:shadow-md transition duration-150 ease-in-out" */}
                            <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out ">
                                <CardContent className="p-4">
                                    <p className="text-xl text-primary">{set.setName}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Created: {new Date(set.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// export const dynamic = 'force-dynamic'
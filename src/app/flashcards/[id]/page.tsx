"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Loader2,
  Trash,
  Brain,
  BookOpen,
  Eye,
  GraduationCap,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import type { Flashcard } from "@/types";
import { useUser } from "@clerk/nextjs";
import StudyMode from "@/components/study/StudyMode";
import { FlashcardSkeleton } from "@/components/ui/skeleton-cards";

export default function FlashcardSetPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flip, setFlip] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<boolean>(false);
  const [deckName, setDeckName] = useState<string>('Study Deck');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const { user, isLoaded } = useUser();

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  // ✅ FIXED: ALL HOOKS AT THE TOP LEVEL - No conditional calls
  const handleFlip = useCallback(() => setFlip(!flip), [flip]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlip(false);
  }, [flashcards.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setFlip(false);
  }, [flashcards.length]);

  const startStudyMode = useCallback(() => {
    setStudyMode(true);
  }, []);

  const exitStudyMode = useCallback(() => {
    setStudyMode(false);
  }, []);

  const toggleMode = useCallback(() => {
    if (studyMode) {
      exitStudyMode();
    } else {
      startStudyMode();
    }
  }, [studyMode, exitStudyMode, startStudyMode]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  }, [touchStart, touchEnd, handleNext, handlePrevious]);

  // ✅ FIXED: useEffect with proper dependencies
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleFlip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious]);

  useEffect(() => {
    if (id && isLoaded && user) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/flashcards/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch flashcards');
          }
          
          const fetchedFlashcards = await response.json();
          
          const mappedFlashcards = fetchedFlashcards.map((card: any) => ({
            ...card,
            flashcardId: card.id,
            setId: card.deckId,
          }));
          
          setFlashcards(mappedFlashcards);
          
          if (mappedFlashcards.length > 0) {
            setDeckName(`Flashcard Set`);
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id, isLoaded, user]);

  // ✅ NOW SAFE: All hooks called, can have conditional logic and early returns
  const currentCard = flashcards[currentIndex];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Loading with skeleton
  if (loading) {
    return (
      <div className="min-h-screen p-4 relative page-container">
        <Button
          variant="outline"
          className="absolute top-4 left-4"
          size="icon"
          disabled
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <FlashcardSkeleton />
        </div>
      </div>
    );
  }

  const handleDeleteSet = async () => {
    try {
      const response = await fetch(`/api/decks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        router.push("/flashcards");
      } else {
        throw new Error('Failed to delete deck');
      }
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
    }
  };

  // Study Mode View
  if (studyMode) {
    return (
      <div className="min-h-screen p-2 sm:p-4 relative">
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
          <Button
            variant="outline"
            onClick={exitStudyMode}
            className="flex items-center gap-2 text-sm"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Study Mode</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
        
        <StudyMode
          deckId={id!}
          deckName={deckName}
          flashcards={flashcards}
          onComplete={exitStudyMode}
        />
      </div>
    );
  }

  // Browse view
  return (
    <div className="min-h-screen p-2 sm:p-4 relative page-container">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-4 sm:mb-0 sm:absolute sm:top-4 sm:left-4 sm:right-4">
        <Button
          variant="outline"
          onClick={() => router.push("/flashcards")}
          size="sm"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        {flashcards.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMode}
              variant={studyMode ? "default" : "outline"}
              className={`flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm ${
                studyMode 
                  ? "bg-purple-600 hover:bg-purple-500 text-white" 
                  : "border-purple-200 text-purple-700 hover:bg-purple-50"
              }`}
              size="sm"
            >
              {studyMode ? (
                <>
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Study Mode</span>
                  <span className="sm:hidden">Study</span>
                  <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Browse Mode</span>
                  <span className="sm:hidden">Browse</span>
                  <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          </div>
        )}
        
        <Button
          variant="outline"
          onClick={handleDeleteSet}
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main content */}
      {flashcards.length > 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 pt-16 sm:pt-4">
          <Card className="w-full max-w-3xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Flashcards</span>
                  <span className="sm:hidden">Cards</span>
                </CardTitle>
                <Badge variant="secondary" className="text-xs">{flashcards.length}</Badge>
              </div>
              {currentCard && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentIndex + 1}/{flashcards.length}
                </p>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 text-center">
                <Badge variant="outline" className="text-xs">
                  <span className="hidden sm:inline">
                    Browse Mode - Click the toggle above to switch to Study Mode
                  </span>
                  <span className="sm:hidden">
                    Swipe or use buttons to navigate
                  </span>
                </Badge>
              </div>
              
              <Card 
                className="bg-secondary"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <CardContent className="p-4 sm:p-6 h-48 sm:h-64 flex flex-col justify-center items-center">
                  {currentCard ? (
                    <>
                      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center px-2">
                        {currentCard.question}
                      </h2>
                      {flip && (
                        <p className="text-muted-foreground mx-auto text-base sm:text-lg text-center px-2">
                          {currentCard.answer}
                        </p>
                      )}
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
                  size="sm"
                  disabled={!currentCard}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Flip</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePrevious}
                    variant="ghost"
                    size="sm"
                    disabled={!currentCard}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="ghost"
                    size="sm"
                    disabled={!currentCard}
                    className="flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button
                  onClick={startStudyMode}
                  className="bg-purple-600 hover:bg-purple-500 flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Switch to Study Mode for Better Learning</span>
                  <span className="sm:hidden">Study Mode</span>
                </Button>
              </div>

              <div className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
                💡 Swipe left/right to navigate cards
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-muted-foreground">
                No flashcards found for this set.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

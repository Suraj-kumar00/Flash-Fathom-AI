"use client";

import { useState, useEffect, useCallback } from 'react'; // ✅ ADDED: useCallback import
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Brain,
  Trophy,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Flashcard } from '@/types';
import { StudyModeSkeleton } from '@/components/ui/skeleton-cards';

interface StudyModeProps {
  deckId: string;
  deckName: string;
  flashcards: Flashcard[];
  onComplete: () => void;
}

export default function StudyMode({ deckId, deckName, flashcards, onComplete }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    startTime: Date.now()
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const { toast } = useToast();

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex) / flashcards.length) * 100;
  const isLastCard = currentIndex === flashcards.length - 1;

  // Touch gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isLastCard) {
      // Swipe left for next card (after answering)
      if (isFlipped) {
        handleAnswer('MEDIUM', true);
      }
    }
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right for previous card (not implemented in study mode)
      // Could add navigation back if needed
    }
  };

  // ✅ FIXED: Wrap initializeStudySession in useCallback with proper dependencies
  const initializeStudySession = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/study/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId })
      });
      
      if (response.ok) {
        const { sessionId: newSessionId } = await response.json();
        setSessionId(newSessionId);
      }
    } catch (error) {
      console.error('Failed to initialize study session:', error);
      toast({
        variant: "destructive",
        title: "Session Error",
        description: "Failed to start study session. Continue anyway?"
      });
    } finally {
      setLoading(false);
    }
  }, [deckId, toast]); // ✅ ADDED: Dependencies

  // ✅ FIXED: Initialize study session with proper dependency
  useEffect(() => {
    initializeStudySession();
  }, [initializeStudySession]); // ✅ ADDED: initializeStudySession dependency

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async (difficulty: 'EASY' | 'MEDIUM' | 'HARD', isCorrect: boolean) => {
    if (!sessionId || !currentCard || submittingAnswer) return;

    try {
      setSubmittingAnswer(true);
      
      // Record the answer
      await fetch('/api/study/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          flashcardId: currentCard.id,
          isCorrect,
          difficulty,
          timeSpent: Math.floor((Date.now() - studyStats.startTime) / 1000)
        })
      });

      // Update stats
      setStudyStats(prev => ({
        ...prev,
        [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
      }));

      // Move to next card or complete
      if (isLastCard) {
        completeStudySession();
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }

    } catch (error) {
      console.error('Failed to record answer:', error);
      toast({
        variant: "destructive",
        title: "Failed to save progress",
        description: "Your answer wasn't recorded. Please try again."
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const completeStudySession = async () => {
    if (!sessionId) return;

    try {
      await fetch('/api/study/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          stats: studyStats,
          duration: Date.now() - studyStats.startTime
        })
      });

      toast({
        title: "🎉 Study Session Complete!",
        description: `You studied ${flashcards.length} cards. Great job!`
      });

      onComplete();
    } catch (error) {
      console.error('Failed to complete study session:', error);
    }
  };

  const skipCard = () => {
    setStudyStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    
    if (isLastCard) {
      completeStudySession();
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  // Loading state
  if (loading) {
    return <StudyModeSkeleton />;
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No flashcards available for study.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          <span className="hidden sm:inline">Study Mode - </span>
          <span className="truncate max-w-48 sm:max-w-none">{deckName}</span>
        </h1>
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            {currentIndex + 1}/{flashcards.length}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            {studyStats.correct}
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            {studyStats.incorrect}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2" />
      </div>

      {/* Flashcard with Touch Support */}
      <div className="relative">
        <Card 
          className={`min-h-[250px] sm:min-h-[300px] cursor-pointer transition-all duration-300 hover:shadow-lg ${
            isFlipped ? 'bg-blue-50 dark:bg-blue-950' : 'bg-white dark:bg-gray-900'
          }`}
          onClick={handleFlip}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <CardContent className="p-4 sm:p-8 flex flex-col items-center justify-center text-center min-h-[230px] sm:min-h-[280px]">
            {!isFlipped ? (
              <div className="space-y-3 sm:space-y-4">
                <Badge variant="outline" className="mb-2 sm:mb-4 text-xs sm:text-sm">Question</Badge>
                <h2 className="text-lg sm:text-xl font-semibold leading-relaxed px-2">
                  {currentCard.question}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
                  <span className="hidden sm:inline">Click to reveal answer</span>
                  <span className="sm:hidden">Tap to reveal answer</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <Badge variant="outline" className="mb-2 sm:mb-4 bg-blue-100 text-blue-800 text-xs sm:text-sm">Answer</Badge>
                <p className="text-base sm:text-lg leading-relaxed px-2">
                  {currentCard.answer}
                </p>
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    How well did you know this?
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flip Indicator */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <Button variant="ghost" size="sm" onClick={handleFlip}>
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Answer Buttons */}
      {isFlipped && (
        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => handleAnswer('HARD', false)}
            disabled={submittingAnswer}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center gap-2 text-sm"
          >
            <XCircle className="h-4 w-4" />
            {/* ✅ FIXED: Escaped apostrophe properly */}
            <span className="hidden sm:inline">Didn&apos;t Know</span>
            <span className="sm:hidden">Hard</span>
          </Button>
          <Button
            onClick={() => handleAnswer('MEDIUM', true)}
            disabled={submittingAnswer}
            variant="outline"
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 flex items-center justify-center gap-2 text-sm"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Knew It</span>
            <span className="sm:hidden">Medium</span>
          </Button>
          <Button
            onClick={() => handleAnswer('EASY', true)}
            disabled={submittingAnswer}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2 text-sm"
          >
            <Trophy className="h-4 w-4" />
            Easy!
          </Button>
        </div>
      )}

      {/* Skip Button */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={skipCard} 
          className="text-muted-foreground text-sm"
          disabled={submittingAnswer}
        >
          Skip Card
        </Button>
      </div>

      {/* Mobile swipe hint */}
      <div className="text-center text-xs text-muted-foreground sm:hidden">
        💡 Swipe left after answering to go to next card
      </div>
    </div>
  );
}

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
      {/* Header - Enhanced with gradient and better dark mode support */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            Study Mode
          </h1>
        </div>
        <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
          {deckName}
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {currentIndex + 1}/{flashcards.length}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-700 dark:text-green-400">
              {studyStats.correct}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-red-700 dark:text-red-400">
              {studyStats.incorrect}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar - Enhanced styling */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Progress</span>
          <span className="text-purple-600 dark:text-purple-400">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Progress 
            value={progress} 
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 transition-all duration-500 ease-out" 
          />
        </div>
      </div>

      {/* Flashcard with Touch Support - Enhanced with better theme support */}
      <div className="relative group">
        <Card 
          className={`min-h-[280px] sm:min-h-[350px] cursor-pointer transition-all duration-300 border-2 ${
            isFlipped 
              ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl' 
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 shadow-md hover:shadow-xl'
          } hover:scale-[1.02] transform`}
          onClick={handleFlip}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <CardContent className="p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[260px] sm:min-h-[330px]">
            {!isFlipped ? (
              <div className="space-y-4 sm:space-y-6 w-full">
                <Badge 
                  variant="outline" 
                  className="mb-3 sm:mb-4 text-xs sm:text-sm border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-1"
                >
                  Question
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold leading-relaxed px-2 text-gray-900 dark:text-white">
                  {currentCard.question}
                </h2>
                <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <RotateCcw className="h-4 w-4 animate-pulse" />
                  <p className="font-medium">
                    <span className="hidden sm:inline">Click to reveal answer</span>
                    <span className="sm:hidden">Tap to reveal</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 w-full">
                <Badge 
                  variant="outline" 
                  className="mb-3 sm:mb-4 text-xs sm:text-sm border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-1"
                >
                  Answer
                </Badge>
                <p className="text-lg sm:text-xl leading-relaxed px-2 text-gray-800 dark:text-gray-200 font-medium">
                  {currentCard.answer}
                </p>
                <div className="mt-6 sm:mt-8">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    How well did you know this?
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flip Indicator - Enhanced */}
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFlip}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200 shadow-md"
          >
            <RotateCcw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </Button>
        </div>
      </div>

      {/* Answer Buttons - Enhanced with better hover effects and dark mode */}
      {isFlipped && (
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={() => handleAnswer('HARD', false)}
            disabled={submittingAnswer}
            variant="outline"
            className="group border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-400 dark:hover:border-red-600 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold py-5 sm:py-6 shadow-md hover:shadow-lg"
          >
            <XCircle className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline">Didn&apos;t Know</span>
            <span className="sm:hidden">Hard</span>
          </Button>
          <Button
            onClick={() => handleAnswer('MEDIUM', true)}
            disabled={submittingAnswer}
            variant="outline"
            className="group border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 hover:border-yellow-400 dark:hover:border-yellow-600 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold py-5 sm:py-6 shadow-md hover:shadow-lg"
          >
            <Clock className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline">Knew It</span>
            <span className="sm:hidden">Medium</span>
          </Button>
          <Button
            onClick={() => handleAnswer('EASY', true)}
            disabled={submittingAnswer}
            variant="outline"
            className="group border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 hover:border-green-400 dark:hover:border-green-600 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold py-5 sm:py-6 shadow-md hover:shadow-lg"
          >
            <Trophy className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Easy!
          </Button>
        </div>
      )}

      {/* Skip Button - Enhanced */}
      <div className="text-center pt-2">
        <Button 
          variant="ghost" 
          onClick={skipCard} 
          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm sm:text-base font-medium transition-all duration-200"
          disabled={submittingAnswer}
        >
          Skip Card →
        </Button>
      </div>

      {/* Mobile swipe hint - Enhanced */}
      <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 sm:hidden bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-4">
        💡 <span className="font-medium">Tip:</span> Swipe left after answering to continue
      </div>
    </div>
  );
}

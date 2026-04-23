import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './use-audio';

export type ChimeSound = 'chime' | 'highBell' | 'doubleBell';

export interface ExamSettings {
  perQuestionMode: boolean;
  timePerQuestion: number;
  totalQuestions: number;
  chimeSound: ChimeSound;
}

export function useExamTimer() {
  // Load settings from local storage
  const [settings, setSettings] = useState<ExamSettings>(() => {
    const saved = localStorage.getItem('examSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      perQuestionMode: true,
      timePerQuestion: 60,
      totalQuestions: 50,
      chimeSound: 'chime' as ChimeSound,
    };
  });

  useEffect(() => {
    localStorage.setItem('examSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<ExamSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Time state
  // In per-question mode: remaining time for current question
  // In total mode: total remaining time
  const [timeRemaining, setTimeRemaining] = useState(
    settings.perQuestionMode ? settings.timePerQuestion : settings.timePerQuestion * settings.totalQuestions
  );

  const { playSound, playDoubleBell } = useAudio();
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const resetExam = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentQuestion(1);
    setCompletedQuestions(new Set());
    setTimeRemaining(
      settings.perQuestionMode ? settings.timePerQuestion : settings.timePerQuestion * settings.totalQuestions
    );
  }, [settings]);

  // Adjust state if settings change (e.g. max questions reduced)
  useEffect(() => {
    if (currentQuestion > settings.totalQuestions) {
      setCurrentQuestion(settings.totalQuestions);
    }
  }, [settings.totalQuestions, currentQuestion]);

  const advanceQuestion = useCallback((isManual = false) => {
    setCompletedQuestions((prev) => {
      const next = new Set(prev);
      next.add(currentQuestion);
      return next;
    });

    if (currentQuestion < settings.totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      if (settings.perQuestionMode || isManual) {
        setTimeRemaining(settings.perQuestionMode ? settings.timePerQuestion : timeRemaining); // keep total time going if total mode
      }
    } else {
      setIsFinished(true);
      setIsPlaying(false);
    }
  }, [currentQuestion, settings.totalQuestions, settings.perQuestionMode, settings.timePerQuestion, timeRemaining]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
      if (settings.perQuestionMode) {
        setTimeRemaining(settings.timePerQuestion);
      }
    }
  }, [currentQuestion, settings.perQuestionMode, settings.timePerQuestion]);

  const goToQuestion = useCallback((q: number) => {
    if (q >= 1 && q <= settings.totalQuestions) {
      setCurrentQuestion(q);
      if (settings.perQuestionMode) {
        setTimeRemaining(settings.timePerQuestion);
      }
    }
  }, [settings.totalQuestions, settings.perQuestionMode, settings.timePerQuestion]);

  const tick = useCallback(() => {
    if (!isPlaying || isFinished) return;

    setTimeRemaining((prev) => {
      if (prev <= 1) {
        // Time's up
        if (settings.perQuestionMode) {
          if (currentQuestion === settings.totalQuestions) {
            playDoubleBell();
            setIsFinished(true);
            setIsPlaying(false);
            return 0;
          } else {
            playSound(settings.chimeSound);
            // Need to use timeout to avoid React complaining about setting state during render sometimes if this was synchronous, though here it's in a timeout anyway.
            setTimeout(() => advanceQuestion(false), 0);
            return settings.timePerQuestion; // Reset for next
          }
        } else {
          // Total mode ended
          playDoubleBell();
          setIsFinished(true);
          setIsPlaying(false);
          return 0;
        }
      }
      return prev - 1;
    });
  }, [isPlaying, isFinished, settings.perQuestionMode, settings.timePerQuestion, settings.chimeSound, currentQuestion, settings.totalQuestions, playDoubleBell, playSound, advanceQuestion]);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = window.setInterval(tick, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, tick]);

  const togglePlay = useCallback(() => {
    if (isFinished) return;
    setIsPlaying((p) => !p);
  }, [isFinished]);

  return {
    settings,
    updateSettings,
    currentQuestion,
    completedQuestions,
    isPlaying,
    isFinished,
    timeRemaining,
    resetExam,
    advanceQuestion,
    previousQuestion,
    goToQuestion,
    togglePlay,
  };
}

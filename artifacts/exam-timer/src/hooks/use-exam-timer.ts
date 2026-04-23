import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './use-audio';

import type { SoundId } from '@/lib/sound-library';

export type ChimeSound = SoundId;

export interface ExamSettings {
  perQuestionMode: boolean;
  timePerQuestion: number;
  totalQuestions: number;
  chimeSound: ChimeSound;
  extraTime: number;
}

export function useExamTimer() {
  // Load settings from local storage
  const [settings, setSettings] = useState<ExamSettings>(() => {
    const defaults: ExamSettings = {
      perQuestionMode: true,
      timePerQuestion: 60,
      totalQuestions: 50,
      chimeSound: 'chime' as ChimeSound,
      extraTime: 60,
    };
    const saved = localStorage.getItem('examSettings');
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch (e) {
        // ignore
      }
    }
    return defaults;
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
  const [inExtraTime, setInExtraTime] = useState(false);

  // Time state
  // In per-question mode: remaining time for current question
  // In total mode: total remaining time
  // During extra-time phase: remaining extra-time seconds
  const [timeRemaining, setTimeRemaining] = useState(
    settings.perQuestionMode ? settings.timePerQuestion : settings.timePerQuestion * settings.totalQuestions
  );

  const { playSound, playSoundTwice } = useAudio();
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const resetExam = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setInExtraTime(false);
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

  const finishExam = useCallback(() => {
    playSoundTwice(settings.chimeSound);
    setIsFinished(true);
    setIsPlaying(false);
    setInExtraTime(false);
  }, [playSoundTwice, settings.chimeSound]);

  const enterExtraTime = useCallback(() => {
    // Mark final question complete and signal end-of-exam with double bell
    setCompletedQuestions((prev) => {
      const next = new Set(prev);
      next.add(settings.totalQuestions);
      return next;
    });
    playSoundTwice(settings.chimeSound);
    if (settings.extraTime > 0) {
      setInExtraTime(true);
      setTimeRemaining(settings.extraTime);
    } else {
      setIsFinished(true);
      setIsPlaying(false);
    }
  }, [playSoundTwice, settings.chimeSound, settings.extraTime, settings.totalQuestions]);

  const tick = useCallback(() => {
    if (!isPlaying || isFinished) return;

    setTimeRemaining((prev) => {
      if (prev <= 1) {
        // Time's up
        if (inExtraTime) {
          // Extra-time period finished
          finishExam();
          return 0;
        }

        if (settings.perQuestionMode) {
          if (currentQuestion === settings.totalQuestions) {
            // Last question ended — double bell, then optional extra time
            enterExtraTime();
            return settings.extraTime > 0 ? settings.extraTime : 0;
          } else {
            playSound(settings.chimeSound);
            setTimeout(() => advanceQuestion(false), 0);
            return settings.timePerQuestion; // Reset for next
          }
        } else {
          // Total mode ended — double bell, then optional extra time
          enterExtraTime();
          return settings.extraTime > 0 ? settings.extraTime : 0;
        }
      }
      return prev - 1;
    });
  }, [
    isPlaying,
    isFinished,
    inExtraTime,
    settings.perQuestionMode,
    settings.timePerQuestion,
    settings.extraTime,
    settings.chimeSound,
    currentQuestion,
    settings.totalQuestions,
    playSound,
    advanceQuestion,
    enterExtraTime,
    finishExam,
  ]);

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
    inExtraTime,
    timeRemaining,
    resetExam,
    advanceQuestion,
    previousQuestion,
    goToQuestion,
    togglePlay,
  };
}

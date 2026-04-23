import { Play, Pause, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime, formatTimeDigital } from '@/lib/format-time';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ExamSettings } from '@/hooks/use-exam-timer';
import { SettingsSheet } from './SettingsSheet';

interface MainTimerProps {
  timeRemaining: number;
  totalTimeRemaining: number;
  totalExamTime: number;
  isPlaying: boolean;
  isFinished: boolean;
  inExtraTime?: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  perQuestionMode: boolean;
  isLastQuestion: boolean;
  settings: ExamSettings;
  updateSettings: (s: Partial<ExamSettings>) => void;
}

export function MainTimer({
  timeRemaining,
  totalTimeRemaining,
  totalExamTime,
  isPlaying,
  isFinished,
  inExtraTime = false,
  onTogglePlay,
  onReset,
  perQuestionMode,
  isLastQuestion,
  settings,
  updateSettings,
}: MainTimerProps) {
  const isUrgent = (perQuestionMode || inExtraTime) && !isFinished && timeRemaining <= 10 && timeRemaining > 0;

  const totalDuration = inExtraTime
    ? settings.extraTime
    : perQuestionMode
    ? settings.timePerQuestion
    : settings.timePerQuestion * settings.totalQuestions;
  const progress = isFinished ? 0 : Math.max(0, timeRemaining / totalDuration);
  
  const circumference = 2 * Math.PI * 140; // r=140
  const strokeDashoffset = circumference * (1 - progress);

  let statusLabel = "READY";
  if (isFinished) statusLabel = "TIME UP";
  else if (inExtraTime) statusLabel = isPlaying ? "EXTRA TIME" : "EXTRA TIME PAUSED";
  else if (isPlaying) statusLabel = isLastQuestion ? "FINAL" : "RUNNING";
  else if (timeRemaining < totalDuration) statusLabel = "PAUSED";

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto">
      <div className="relative flex items-center justify-center mb-8 w-80 h-80 sm:w-[26rem] sm:h-[26rem]">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 320 320">
          <circle
            cx="160"
            cy="160"
            r="140"
            className="stroke-muted fill-none"
            strokeWidth="16"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            className={cn(
              "fill-none transition-colors duration-300",
              isUrgent ? "stroke-destructive" : "stroke-secondary"
            )}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset,
            }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className={cn(
            "text-xs sm:text-sm font-bold tracking-widest mb-1 sm:mb-2",
            isUrgent || isFinished ? "text-destructive" : isPlaying ? "text-secondary" : "text-muted-foreground"
          )}>
            {statusLabel}
          </div>
          
          <motion.div
            animate={
              isUrgent
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
            className={cn(
              "font-mono font-bold tracking-tighter",
              "text-6xl sm:text-7xl md:text-8xl text-foreground",
              isUrgent && "text-destructive",
              isFinished && "text-muted-foreground"
            )}
          >
            {formatTimeDigital(timeRemaining)}
          </motion.div>
          
          <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-muted-foreground">
            {formatTime(totalTimeRemaining)} / {formatTime(totalExamTime)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 w-full">
        <Button variant="outline" size="icon" onClick={onReset} className="rounded-full w-12 h-12 border-2 shadow-sm text-foreground hover:bg-accent">
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          size="lg"
          onClick={onTogglePlay}
          className={cn(
            "w-48 h-14 text-base rounded-full shadow-md transition-all font-semibold",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-5 w-5 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5 fill-current" /> Start
            </>
          )}
        </Button>

        <SettingsSheet settings={settings} updateSettings={updateSettings} onReset={onReset} trigger={
          <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-2 shadow-sm text-foreground hover:bg-accent">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        } />
      </div>
    </div>
  );
}

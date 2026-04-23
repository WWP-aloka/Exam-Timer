import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTimeDigital } from '@/lib/format-time';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MainTimerProps {
  timeRemaining: number;
  isPlaying: boolean;
  isFinished: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  perQuestionMode: boolean;
}

export function MainTimer({
  timeRemaining,
  isPlaying,
  isFinished,
  onTogglePlay,
  onReset,
  perQuestionMode,
}: MainTimerProps) {
  const isUrgent = perQuestionMode && !isFinished && timeRemaining <= 10 && timeRemaining > 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <motion.div
        animate={
          isUrgent
            ? {
                scale: [1, 1.02, 1],
                color: ['hsl(var(--foreground))', 'hsl(var(--destructive))', 'hsl(var(--foreground))'],
              }
            : { scale: 1, color: 'hsl(var(--foreground))' }
        }
        transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
        className={cn(
          "font-mono font-bold tracking-tighter transition-colors",
          "text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none",
          isFinished ? "text-muted-foreground" : ""
        )}
      >
        {formatTimeDigital(timeRemaining)}
      </motion.div>

      <div className="flex items-center gap-4">
        {isFinished ? (
          <Button size="lg" onClick={onReset} className="w-40 h-16 text-lg rounded-2xl shadow-lg">
            <RotateCcw className="mr-2 h-6 w-6" /> Restart
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onTogglePlay}
            className={cn(
              "w-40 h-16 text-lg rounded-2xl shadow-lg transition-all",
              isPlaying ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-6 w-6" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-6 w-6" /> Start
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

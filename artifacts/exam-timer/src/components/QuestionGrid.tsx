import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuestionGridProps {
  totalQuestions: number;
  currentQuestion: number;
  completedQuestions: Set<number>;
  onGoToQuestion: (q: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuestionGrid({
  totalQuestions,
  currentQuestion,
  completedQuestions,
  onGoToQuestion,
  onPrevious,
  onNext,
}: QuestionGridProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-card rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-foreground">Question Grid</h3>
        
        <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1 border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-card shadow-sm hover:bg-accent" 
            onClick={onPrevious}
            disabled={currentQuestion <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[3rem] text-center text-foreground">
            {currentQuestion} / {totalQuestions}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-card shadow-sm hover:bg-accent"
            onClick={onNext}
            disabled={currentQuestion >= totalQuestions}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[200px] pr-3">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((q) => {
            const isCurrent = q === currentQuestion;
            const isCompleted = completedQuestions.has(q);

            return (
              <motion.button
                key={q}
                onClick={() => onGoToQuestion(q)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex items-center justify-center h-10 w-full rounded-full text-xs font-semibold transition-all",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : isCompleted
                    ? "bg-muted text-muted-foreground border-muted-foreground/20 border"
                    : "bg-card text-foreground border border-border hover:border-primary/50"
                )}
              >
                {q}
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

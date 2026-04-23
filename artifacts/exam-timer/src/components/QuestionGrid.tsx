import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionGridProps {
  totalQuestions: number;
  currentQuestion: number;
  completedQuestions: Set<number>;
  onGoToQuestion: (q: number) => void;
}

export function QuestionGrid({
  totalQuestions,
  currentQuestion,
  completedQuestions,
  onGoToQuestion,
}: QuestionGridProps) {
  const completedCount = completedQuestions.size;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-card rounded-3xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Question Grid</h3>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {completedCount} / {totalQuestions} Completed
        </span>
      </div>

      <ScrollArea className="h-[240px] pr-4">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
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
                  "relative flex items-center justify-center h-12 w-full rounded-xl text-sm font-medium transition-all duration-200",
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background z-10"
                    : isCompleted
                    ? "bg-muted text-muted-foreground border border-muted-border opacity-70"
                    : "bg-card text-card-foreground border hover:border-primary/50 hover:bg-accent"
                )}
              >
                {q}
                {isCompleted && !isCurrent && (
                  <div className="absolute inset-0 bg-background/10 rounded-xl" />
                )}
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

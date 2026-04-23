import { Moon, Sun, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSheet } from './SettingsSheet';
import { useTheme } from 'next-themes';
import { ExamSettings } from '@/hooks/use-exam-timer';

interface HeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  settings: ExamSettings;
  updateSettings: (s: Partial<ExamSettings>) => void;
  onReset: () => void;
}

export function Header({ currentQuestion, totalQuestions, settings, updateSettings, onReset }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg hidden sm:block tracking-tight text-primary">EXAM TIMER - UoM</h1>
          <h1 className="font-bold text-lg sm:hidden tracking-tight text-primary">UoM</h1>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="font-mono text-sm font-medium bg-muted px-3 py-1 rounded-full">
            Question {currentQuestion} of {totalQuestions}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onReset} className="rounded-full" title="Reset Exam">
            <RotateCcw className="h-5 w-5" />
          </Button>
          <SettingsSheet settings={settings} updateSettings={updateSettings} onReset={onReset} />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

import { Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSheet } from './SettingsSheet';
import { ExamSettings } from '@/hooks/use-exam-timer';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  settings: ExamSettings;
  updateSettings: (s: Partial<ExamSettings>) => void;
  onReset: () => void;
}

export function Header({ currentQuestion, totalQuestions, settings, updateSettings, onReset }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="w-full pt-4 pb-2 bg-transparent">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <SettingsSheet settings={settings} updateSettings={updateSettings} onReset={onReset} trigger={
            <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          } />

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-foreground">EXAM TIMER - UoM</h1>
              <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                {totalQuestions} Qs
              </span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border text-muted-foreground hover:text-foreground" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 bg-card border shadow-sm px-4 py-1.5 rounded-full text-sm font-medium">
          <div className="h-2 w-2 rounded-full bg-secondary" />
          <span className="text-foreground">QUESTION {currentQuestion}</span>
          <span className="text-muted-foreground">/ {totalQuestions}</span>
        </div>
      </div>
    </header>
  );
}

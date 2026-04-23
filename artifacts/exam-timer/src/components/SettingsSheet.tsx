import { Settings2, Moon, Sun, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExamSettings, ChimeSound } from '@/hooks/use-exam-timer';
import { formatTime } from '@/lib/format-time';
import { useAudio } from '@/hooks/use-audio';
import { SOUND_LIBRARY } from '@/lib/sound-library';

interface SettingsSheetProps {
  settings: ExamSettings;
  updateSettings: (s: Partial<ExamSettings>) => void;
  onReset: () => void;
  trigger?: ReactNode;
}

export function SettingsSheet({ settings, updateSettings, onReset, trigger }: SettingsSheetProps) {
  const { theme, setTheme } = useTheme();
  const { playSound } = useAudio();

  const chimeOptions = SOUND_LIBRARY.map((s) => ({ value: s.id, label: s.label }));

  const handleTimeChange = (val: number) => {
    updateSettings({ timePerQuestion: val });
  };

  const handleQuestionsChange = (val: number) => {
    updateSettings({ totalQuestions: val });
  };

  const handleExtraTimeChange = (val: number) => {
    updateSettings({ extraTime: Math.max(0, val) });
  };

  const timePresets = [30, 60, 90, 120, 180, 300];
  const questionPresets = [10, 25, 50, 100, 150, 200];
  const extraTimePresets = [0, 30, 60, 120, 300, 600];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Exam Settings</SheetTitle>
          <SheetDescription>Configure your practice session.</SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle theme.</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-2xl border space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">End-of-Question Sound</Label>
                <p className="text-sm text-muted-foreground">Plays when the per-question timer ends.</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => playSound(settings.chimeSound)}
                aria-label="Preview sound"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={settings.chimeSound}
              onValueChange={(v) => updateSettings({ chimeSound: v as ChimeSound })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chimeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Per-Question Mode</Label>
              <p className="text-sm text-muted-foreground">Auto-advance when time is up.</p>
            </div>
            <Switch
              checked={settings.perQuestionMode}
              onCheckedChange={(c) => updateSettings({ perQuestionMode: c })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Time per Question</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={10}
                  max={600}
                  value={settings.timePerQuestion}
                  onChange={(e) => handleTimeChange(Number(e.target.value) || 60)}
                  className="w-20 text-right"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
            <Slider
              min={10}
              max={600}
              step={10}
              value={[settings.timePerQuestion]}
              onValueChange={([v]) => handleTimeChange(v)}
            />
            <div className="flex flex-wrap gap-2">
              {timePresets.map((t) => (
                <Button
                  key={t}
                  variant={settings.timePerQuestion === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeChange(t)}
                  className="rounded-full text-xs"
                >
                  {t < 60 ? `${t}s` : `${t / 60}m`}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Total Questions</Label>
              <Input
                type="number"
                min={1}
                max={500}
                value={settings.totalQuestions}
                onChange={(e) => handleQuestionsChange(Number(e.target.value) || 50)}
                className="w-20 text-right"
              />
            </div>
            <Slider
              min={1}
              max={200}
              step={1}
              value={[settings.totalQuestions]}
              onValueChange={([v]) => handleQuestionsChange(v)}
            />
            <div className="flex flex-wrap gap-2">
              {questionPresets.map((q) => (
                <Button
                  key={q}
                  variant={settings.totalQuestions === q ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleQuestionsChange(q)}
                  className="rounded-full text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Extra Time After Final Question</Label>
                <p className="text-sm text-muted-foreground">
                  After the last question, an extra period is added. The selected sound plays twice
                  at the start of this period and again when it ends.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Input
                  type="number"
                  min={0}
                  max={3600}
                  value={settings.extraTime}
                  onChange={(e) => handleExtraTimeChange(Number(e.target.value) || 0)}
                  className="w-20 text-right"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
            <Slider
              min={0}
              max={900}
              step={10}
              value={[settings.extraTime]}
              onValueChange={([v]) => handleExtraTimeChange(v)}
            />
            <div className="flex flex-wrap gap-2">
              {extraTimePresets.map((t) => (
                <Button
                  key={t}
                  variant={settings.extraTime === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleExtraTimeChange(t)}
                  className="rounded-full text-xs"
                >
                  {t === 0 ? 'Off' : t < 60 ? `${t}s` : `${t / 60}m`}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Question Time</span>
              <span className="font-semibold">{formatTime(settings.totalQuestions * settings.timePerQuestion)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Extra Time</span>
              <span className="font-semibold">{formatTime(settings.extraTime)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Total Exam Time</span>
              <span className="font-semibold">{formatTime(settings.totalQuestions * settings.timePerQuestion + settings.extraTime)}</span>
            </div>
            <Button variant="destructive" className="w-full rounded-xl" onClick={onReset}>
              Reset Exam Session
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

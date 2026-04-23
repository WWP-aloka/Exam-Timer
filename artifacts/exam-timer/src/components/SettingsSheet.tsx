import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ExamSettings } from '@/hooks/use-exam-timer';
import { formatTime } from '@/lib/format-time';

interface SettingsSheetProps {
  settings: ExamSettings;
  updateSettings: (s: Partial<ExamSettings>) => void;
  onReset: () => void;
}

export function SettingsSheet({ settings, updateSettings, onReset }: SettingsSheetProps) {
  const handleTimeChange = (val: number) => {
    updateSettings({ timePerQuestion: val });
  };

  const handleQuestionsChange = (val: number) => {
    updateSettings({ totalQuestions: val });
  };

  const timePresets = [30, 60, 90, 120, 180, 300];
  const questionPresets = [10, 25, 50, 100, 150, 200];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings2 className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Exam Settings</SheetTitle>
          <SheetDescription>Configure your practice session.</SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
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

          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Exam Time</span>
              <span className="font-semibold">{formatTime(settings.totalQuestions * settings.timePerQuestion)}</span>
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

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isFinished: boolean;
}

export function NavControls({ onPrevious, onNext, canGoPrevious, canGoNext, isFinished }: NavControlsProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-8">
      <Button
        variant="outline"
        size="lg"
        onClick={onPrevious}
        disabled={!canGoPrevious || isFinished}
        className="w-32 rounded-2xl h-14"
      >
        <ChevronLeft className="mr-2 h-5 w-5" /> Prev
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onNext}
        disabled={!canGoNext || isFinished}
        className="w-32 rounded-2xl h-14"
      >
        Next <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

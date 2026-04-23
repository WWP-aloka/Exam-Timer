import { useExamTimer } from '@/hooks/use-exam-timer';
import { useWakeLock } from '@/hooks/use-wake-lock';
import { Header } from '@/components/Header';
import { MainTimer } from '@/components/MainTimer';
import { QuestionGrid } from '@/components/QuestionGrid';

export function ExamPage() {
  useWakeLock();
  
  const {
    settings,
    updateSettings,
    currentQuestion,
    completedQuestions,
    isPlaying,
    isFinished,
    timeRemaining,
    resetExam,
    advanceQuestion,
    previousQuestion,
    goToQuestion,
    togglePlay,
  } = useExamTimer();

  const totalTime = settings.totalQuestions * settings.timePerQuestion;
  const remainingTotalTime = settings.perQuestionMode
    ? timeRemaining + (settings.totalQuestions - currentQuestion) * settings.timePerQuestion
    : timeRemaining;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header
        currentQuestion={currentQuestion}
        totalQuestions={settings.totalQuestions}
        settings={settings}
        updateSettings={updateSettings}
        onReset={resetExam}
      />
      
      <main className="flex-1 flex flex-col container mx-auto px-4 pb-8 max-w-5xl">
        <div className="flex-1 flex flex-col justify-center gap-6">
          <MainTimer
            timeRemaining={timeRemaining}
            totalTimeRemaining={remainingTotalTime}
            totalExamTime={totalTime}
            isPlaying={isPlaying}
            isFinished={isFinished}
            onTogglePlay={togglePlay}
            onReset={resetExam}
            perQuestionMode={settings.perQuestionMode}
            isLastQuestion={currentQuestion === settings.totalQuestions}
            settings={settings}
            updateSettings={updateSettings}
          />
          
          <QuestionGrid
            totalQuestions={settings.totalQuestions}
            currentQuestion={currentQuestion}
            completedQuestions={completedQuestions}
            onGoToQuestion={goToQuestion}
            onPrevious={previousQuestion}
            onNext={() => advanceQuestion(true)}
          />
        </div>
      </main>
    </div>
  );
}

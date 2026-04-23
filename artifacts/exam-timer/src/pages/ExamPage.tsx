import { useExamTimer } from '@/hooks/use-exam-timer';
import { useWakeLock } from '@/hooks/use-wake-lock';
import { Header } from '@/components/Header';
import { MainTimer } from '@/components/MainTimer';
import { NavControls } from '@/components/NavControls';
import { QuestionGrid } from '@/components/QuestionGrid';
import { formatTime } from '@/lib/format-time';

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
      
      <main className="flex-1 flex flex-col container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-4 space-y-2">
            <h2 className="text-xl font-medium text-muted-foreground">
              {settings.perQuestionMode ? "Time Remaining for Question" : "Total Time Remaining"}
            </h2>
            <div className="text-sm font-medium bg-muted inline-block px-3 py-1 rounded-full text-muted-foreground">
              Total Exam: {formatTime(remainingTotalTime)} / {formatTime(totalTime)}
            </div>
          </div>
          
          <MainTimer
            timeRemaining={timeRemaining}
            isPlaying={isPlaying}
            isFinished={isFinished}
            onTogglePlay={togglePlay}
            onReset={resetExam}
            perQuestionMode={settings.perQuestionMode}
          />
          
          <NavControls
            onPrevious={previousQuestion}
            onNext={() => advanceQuestion(true)}
            canGoPrevious={currentQuestion > 1}
            canGoNext={currentQuestion < settings.totalQuestions}
            isFinished={isFinished}
          />
        </div>

        <QuestionGrid
          totalQuestions={settings.totalQuestions}
          currentQuestion={currentQuestion}
          completedQuestions={completedQuestions}
          onGoToQuestion={goToQuestion}
        />
      </main>
    </div>
  );
}

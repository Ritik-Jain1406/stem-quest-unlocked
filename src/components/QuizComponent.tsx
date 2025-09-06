import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Question } from '@/types/stem';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizComponentProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return; // Prevent changing answer after showing result
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      // Calculate score and finish
      const correctAnswers = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      setIsFinished(true);
      onComplete(score);
    }
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isFinished) {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 mx-auto text-success mb-4" />
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-lg text-muted-foreground mb-4">
          You scored {score}% ({correctAnswers}/{questions.length} correct)
        </p>
        <div className="w-32 mx-auto">
          <Progress value={score} className="h-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-6">{currentQ.question}</h3>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            disabled={showResult}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex-1 cursor-pointer p-3 rounded-lg border transition-colors ${
                    showResult
                      ? index === currentQ.correctAnswer
                        ? 'bg-success/10 border-success text-success'
                        : index === selectedAnswer && index !== currentQ.correctAnswer
                        ? 'bg-destructive/10 border-destructive text-destructive'
                        : ''
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Explanation */}
          {showResult && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {!showResult ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === undefined}
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'Finish Quiz'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
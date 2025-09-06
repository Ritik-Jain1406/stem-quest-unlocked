import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calculator, RotateCcw, Trophy, Timer, Zap } from 'lucide-react';

interface MathQuestion {
  question: string;
  answer: number;
  operation: string;
}

interface MathQuizProps {
  onComplete?: (score: number) => void;
}

export function MathQuiz({ onComplete }: MathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive]);

  const generateQuestion = (): MathQuestion => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let a: number, b: number, answer: number, question: string;
    
    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
        question = `${a} + ${b}`;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 25;
        b = Math.floor(Math.random() * 25) + 1;
        answer = a - b;
        question = `${a} - ${b}`;
        break;
      case '×':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        answer = a * b;
        question = `${a} × ${b}`;
        break;
      case '÷':
        b = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        a = b * answer;
        question = `${a} ÷ ${b}`;
        break;
      default:
        a = 1; b = 1; answer = 2; question = '1 + 1';
    }
    
    return { question, answer, operation };
  };

  const startGame = () => {
    setCurrentQuestion(generateQuestion());
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(60);
    setIsGameActive(true);
    setIsGameComplete(false);
    setStreak(0);
    setUserAnswer('');
  };

  const endGame = () => {
    setIsGameActive(false);
    setIsGameComplete(true);
    const finalScore = score + streak * 10;
    onComplete?.(finalScore);
  };

  const submitAnswer = () => {
    if (!currentQuestion || !isGameActive) return;

    const userNum = parseInt(userAnswer);
    const isCorrect = userNum === currentQuestion.answer;
    
    if (isCorrect) {
      const points = 10 + Math.max(0, 60 - timeLeft); // Bonus for speed
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');

    // End game after 20 questions or when time runs out
    if (questionsAnswered + 1 >= 20) {
      endGame();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const accuracy = questionsAnswered > 0 ? Math.round((score / (questionsAnswered * 10)) * 100) : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Speed Math Challenge
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            {timeLeft}s
          </Badge>
          <Badge variant="outline">
            Score: {score}
          </Badge>
          {streak > 0 && (
            <Badge className="bg-orange-500 text-white">
              <Zap className="h-4 w-4 mr-1" />
              {streak}x
            </Badge>
          )}
          {isGameComplete && (
            <Badge className="bg-success text-success-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              Complete!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isGameActive && !isGameComplete && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Ready for the challenge?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Solve as many math problems as you can in 60 seconds!
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Get points for correct answers</li>
                <li>• Speed bonus for quick answers</li>
                <li>• Build streak multipliers</li>
              </ul>
            </div>
            <Button onClick={startGame} size="lg" className="w-full">
              Start Challenge
            </Button>
          </div>
        )}

        {isGameActive && currentQuestion && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Question {questionsAnswered + 1}/20
              </div>
              <div className="text-3xl font-bold mb-4 p-4 bg-muted/50 rounded-lg">
                {currentQuestion.question} = ?
              </div>
            </div>
            
            <div className="space-y-2">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer..."
                className="text-center text-lg"
                autoFocus
              />
              <Button 
                onClick={submitAnswer} 
                disabled={!userAnswer.trim()}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Accuracy: {accuracy}% | Streak: {streak}</p>
            </div>
          </div>
        )}

        {isGameComplete && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-success" />
              <h3 className="text-lg font-semibold mb-2">Challenge Complete!</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Final Score:</strong> {score + streak * 10}</p>
                <p><strong>Questions Answered:</strong> {questionsAnswered}</p>
                <p><strong>Accuracy:</strong> {accuracy}%</p>
                <p><strong>Best Streak:</strong> {streak}</p>
              </div>
            </div>
            
            <Button onClick={startGame} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
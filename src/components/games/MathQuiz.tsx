import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MathQuizProps {
  onComplete: () => void;
}

export function MathQuiz({ onComplete }: MathQuizProps) {
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const questions = [
    { q: "5 + 3 = ?", options: [7, 8, 9, 10], correct: 1 },
    { q: "12 - 4 = ?", options: [6, 7, 8, 9], correct: 2 },
    { q: "6 × 7 = ?", options: [40, 41, 42, 43], correct: 2 }
  ];

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentQ].correct) setScore(score + 1);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{questions[currentQ].q}</CardTitle>
        <Progress value={(currentQ + 1) / questions.length * 100} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {questions[currentQ].options.map((opt, idx) => (
            <Button key={idx} onClick={() => handleAnswer(idx)}>{opt}</Button>
          ))}
        </div>
        <p className="mt-4">Score: {score}/{questions.length}</p>
      </CardContent>
    </Card>
  );
}
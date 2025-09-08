import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface STEMPuzzleProps {
  onComplete: () => void;
}

export function STEMPuzzle({ onComplete }: STEMPuzzleProps) {
  const [answered, setAnswered] = useState(false);
  
  const puzzle = {
    question: "A ball is dropped from 10m height. Using g=9.8m/s², how long does it take to hit the ground?",
    options: ["1.0s", "1.4s", "2.0s", "2.8s"],
    correct: 1,
    explanation: "Using h = ½gt², we get t = √(2h/g) = √(20/9.8) ≈ 1.4s"
  };

  const handleAnswer = (idx: number) => {
    setAnswered(true);
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{puzzle.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {puzzle.options.map((opt, idx) => (
            <Button
              key={idx}
              variant={answered && idx === puzzle.correct ? "default" : "outline"}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
            >
              {opt}
            </Button>
          ))}
        </div>
        {answered && (
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm">{puzzle.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
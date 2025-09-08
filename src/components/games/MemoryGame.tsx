import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MemoryGameProps {
  onComplete: () => void;
}

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const cards = ['🧪', '⚡', '🔬', '🧬', '🧪', '⚡', '🔬', '🧬'];

  const handleClick = (idx: number) => {
    if (flipped.length < 2 && !flipped.includes(idx) && !matched.includes(idx)) {
      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);
      
      if (newFlipped.length === 2) {
        setTimeout(() => {
          if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
            setMatched([...matched, ...newFlipped]);
          }
          setFlipped([]);
        }, 1000);
      }
    }
  };

  if (matched.length === cards.length) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">🎉 You Won!</h3>
        <Button onClick={onComplete}>Back to Games</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card, idx) => (
        <Card key={idx} className="cursor-pointer h-20" onClick={() => handleClick(idx)}>
          <CardContent className="p-2 h-full flex items-center justify-center">
            {flipped.includes(idx) || matched.includes(idx) ? card : '❓'}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
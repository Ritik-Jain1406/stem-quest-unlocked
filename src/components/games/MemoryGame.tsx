import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RotateCcw, Trophy, Timer } from 'lucide-react';

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete?: (score: number) => void;
}

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const emojis = ['🧬', '⚗️', '🔬', '🧪', '⚛️', '📐', '🔢', '💡'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameStarted && !isGameComplete) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isGameComplete]);

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    emojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, value: emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, value: emoji, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!isGameStarted) setIsGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.value === secondCard?.value) {
          // Match found
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ));
          
          // Check if game is complete
          const updatedCards = cards.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          );
          
          if (updatedCards.every(c => c.isMatched)) {
            setIsGameComplete(true);
            const score = Math.max(0, 1000 - (moves * 10) - time);
            onComplete?.(score);
          }
        } else {
          // No match - flip cards back
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    initializeGame();
    setIsGameStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          STEM Memory Challenge
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            {formatTime(time)}
          </Badge>
          <Badge variant="outline">
            Moves: {moves}
          </Badge>
          {isGameComplete && (
            <Badge className="bg-success text-success-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              Complete!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl
                ${card.isFlipped || card.isMatched
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-muted hover:bg-muted/80 border-border'
                }
                ${card.isMatched ? 'ring-2 ring-success' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </div>
          ))}
        </div>

        {isGameComplete && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-success">
              🎉 Congratulations! You completed the memory challenge!
            </p>
            <p className="text-muted-foreground">
              Completed in {moves} moves and {formatTime(time)}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
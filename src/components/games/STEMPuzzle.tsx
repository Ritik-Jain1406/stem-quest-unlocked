import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Puzzle, RotateCcw, Trophy, Lightbulb } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  value: number;
  position: number;
}

interface STEMPuzzleProps {
  onComplete?: (score: number) => void;
}

export function STEMPuzzle({ onComplete }: STEMPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const targetSequence = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents empty space

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < 9; i++) {
      newPieces.push({
        id: i,
        value: targetSequence[i],
        position: i
      });
    }
    
    // Shuffle the puzzle
    shufflePuzzle(newPieces);
    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
    setShowHint(false);
  };

  const shufflePuzzle = (pieces: PuzzlePiece[]) => {
    // Perform 100 random valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = pieces.findIndex(p => p.value === 0);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      // Swap empty space with random valid move
      [pieces[emptyIndex], pieces[randomMove]] = [pieces[randomMove], pieces[emptyIndex]];
    }
  };

  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    // Up
    if (row > 0) moves.push(emptyIndex - 3);
    // Down
    if (row < 2) moves.push(emptyIndex + 3);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < 2) moves.push(emptyIndex + 1);

    return moves;
  };

  const handlePieceClick = (clickedIndex: number) => {
    const emptyIndex = pieces.findIndex(p => p.value === 0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(clickedIndex)) {
      const newPieces = [...pieces];
      [newPieces[emptyIndex], newPieces[clickedIndex]] = [newPieces[clickedIndex], newPieces[emptyIndex]];
      
      setPieces(newPieces);
      setMoves(prev => prev + 1);

      // Check if puzzle is solved
      const isSolved = newPieces.every((piece, index) => 
        piece.value === targetSequence[index]
      );

      if (isSolved) {
        setIsComplete(true);
        const score = Math.max(0, 500 - moves * 5);
        onComplete?.(score);
      }
    }
  };

  const getHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  const getPieceColor = (value: number) => {
    const colors = [
      'bg-transparent', // empty space
      'bg-red-400', 'bg-blue-400', 'bg-green-400',
      'bg-yellow-400', 'bg-purple-400', 'bg-pink-400',
      'bg-indigo-400', 'bg-orange-400'
    ];
    return colors[value] || 'bg-gray-400';
  };

  const getCorrectPosition = (value: number) => {
    return targetSequence.indexOf(value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-6 w-6" />
          STEM Number Puzzle
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Moves: {moves}
          </Badge>
          {isComplete && (
            <Badge className="bg-success text-success-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              Solved!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-1 p-4 bg-muted/50 rounded-lg">
          {pieces.map((piece, index) => (
            <div
              key={piece.id}
              onClick={() => handlePieceClick(index)}
              className={`
                aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-2xl font-bold text-white
                ${piece.value === 0 
                  ? 'bg-transparent border-dashed border-muted-foreground/30' 
                  : `${getPieceColor(piece.value)} border-white hover:scale-105 shadow-lg`
                }
                ${showHint && getCorrectPosition(piece.value) === index && piece.value !== 0
                  ? 'ring-2 ring-green-500 animate-pulse'
                  : ''
                }
              `}
            >
              {piece.value !== 0 && piece.value}
            </div>
          ))}
        </div>

        {isComplete && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-success">
              🎉 Excellent problem-solving skills!
            </p>
            <p className="text-muted-foreground">
              Solved in {moves} moves
            </p>
          </div>
        )}

        <div className="flex justify-center gap-2">
          <Button onClick={initializePuzzle} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Puzzle
          </Button>
          {!isComplete && (
            <Button onClick={getHint} variant="outline" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Hint
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>🎯 Goal: Arrange numbers 1-8 in order</p>
          <p>💡 Tip: Click adjacent pieces to the empty space</p>
        </div>
      </CardContent>
    </Card>
  );
}
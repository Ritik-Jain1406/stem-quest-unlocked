import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Star, Play, ArrowLeft } from 'lucide-react';
import { MathQuiz } from './MathQuiz';
import { MemoryGame } from './MemoryGame';
import { STEMPuzzle } from './STEMPuzzle';
import { useTranslation } from '@/hooks/useTranslation';

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'math' | 'science' | 'logic' | 'memory';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  estimatedTime: number;
  component: React.ComponentType<any>;
}

const games: Game[] = [
  {
    id: 'math-quiz',
    title: 'Math Quiz Challenge',
    description: 'Test your mathematical skills with quick calculations',
    category: 'math',
    difficulty: 'medium',
    points: 100,
    estimatedTime: 5,
    component: MathQuiz
  },
  {
    id: 'memory-game',
    title: 'Scientific Memory Match',
    description: 'Match scientific terms and concepts to improve memory',
    category: 'memory',
    difficulty: 'easy',
    points: 50,
    estimatedTime: 3,
    component: MemoryGame
  },
  {
    id: 'stem-puzzle',
    title: 'STEM Logic Puzzle',
    description: 'Solve complex puzzles using STEM concepts',
    category: 'logic',
    difficulty: 'hard',
    points: 200,
    estimatedTime: 10,
    component: STEMPuzzle
  }
];

interface GameHubProps {
  onBack?: () => void;
}

export function GameHub({ onBack }: GameHubProps) {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'hsl(var(--success))';
      case 'medium': return 'hsl(var(--warning))';
      case 'hard': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math': return '🔢';
      case 'science': return '🔬';
      case 'logic': return '🧩';
      case 'memory': return '🧠';
      default: return '🎮';
    }
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                {selectedGame.title}
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedGame(null);
                  onBack?.();
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <GameComponent onComplete={() => setSelectedGame(null)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            Educational Games
          </CardTitle>
          <p className="text-muted-foreground">
            Learn while playing! Interactive games designed for STEM education.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card 
            key={game.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(game.category)}</span>
                  <h3 className="font-semibold">{game.title}</h3>
                </div>
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: getDifficultyColor(game.difficulty),
                    color: getDifficultyColor(game.difficulty)
                  }}
                >
                  {game.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {game.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span>{game.points} points</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-info" />
                  <span>{game.estimatedTime} min</span>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setSelectedGame(game)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Offline Compatible!</h3>
            <p className="text-sm text-muted-foreground">
              All games work offline and are optimized for low-end devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
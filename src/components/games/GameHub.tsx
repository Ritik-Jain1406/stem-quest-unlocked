import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Calculator, Puzzle, Gamepad2 } from 'lucide-react';
import { MemoryGame } from './MemoryGame';
import { STEMPuzzle } from './STEMPuzzle';
import { MathQuiz } from './MathQuiz';

type GameType = 'memory' | 'puzzle' | 'math' | null;

interface GameHubProps {
  onBack?: () => void;
}

export function GameHub({ onBack }: GameHubProps) {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});

  const games = [
    {
      id: 'memory',
      title: 'Memory Challenge',
      description: 'Test your memory with STEM-themed cards',
      icon: <Brain className="h-8 w-8" />,
      difficulty: 'Easy',
      color: 'bg-blue-500',
    },
    {
      id: 'puzzle',
      title: 'Number Puzzle',
      description: 'Solve the sliding number puzzle',
      icon: <Puzzle className="h-8 w-8" />,
      difficulty: 'Medium',
      color: 'bg-green-500',
    },
    {
      id: 'math',
      title: 'Speed Math',
      description: 'Quick math problems under time pressure',
      icon: <Calculator className="h-8 w-8" />,
      difficulty: 'Hard',
      color: 'bg-purple-500',
    },
  ];

  const handleGameComplete = (gameId: string, score: number) => {
    setGameScores(prev => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (activeGame) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setActiveGame(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                Exit Games
              </Button>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            {activeGame === 'memory' && (
              <MemoryGame onComplete={(score) => handleGameComplete('memory', score)} />
            )}
            {activeGame === 'puzzle' && (
              <STEMPuzzle onComplete={(score) => handleGameComplete('puzzle', score)} />
            )}
            {activeGame === 'math' && (
              <MathQuiz onComplete={(score) => handleGameComplete('math', score)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">STEM Fun Games</h1>
            </div>
            <p className="text-muted-foreground">
              Challenge yourself with these offline games designed to improve your STEM skills!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setActiveGame(game.id as GameType)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${game.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                    {gameScores[game.id] && (
                      <Badge variant="outline">
                        Best: {gameScores[game.id]}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  <Button className="w-full group-hover:bg-primary/90">
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>🎯 Benefits of Playing STEM Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong>🧠 Memory Game:</strong></p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Improves visual memory</li>
                      <li>• Enhances pattern recognition</li>
                      <li>• Builds concentration skills</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p><strong>🧩 Number Puzzle:</strong></p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Develops logical thinking</li>
                      <li>• Improves problem-solving</li>
                      <li>• Enhances spatial reasoning</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p><strong>⚡ Speed Math:</strong></p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Strengthens mental math</li>
                      <li>• Improves calculation speed</li>
                      <li>• Builds mathematical confidence</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p><strong>🎮 All Games:</strong></p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Work completely offline</li>
                      <li>• Track your progress</li>
                      <li>• Fun way to learn STEM</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
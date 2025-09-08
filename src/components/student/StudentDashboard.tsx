import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Trophy, Clock, BookOpen, Target, Gamepad2, Microscope } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { GameHub } from '../games/GameHub';
import { VirtualLab } from '../VirtualLab';

interface AvailableQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionsCount: number;
  timeLimit: number;
  maxAttempts: number;
  remainingAttempts: number;
}

interface CompletedQuiz {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  completedAt: string;
  attempt: number;
}

export function StudentDashboard() {
  const { t } = useTranslation();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual data from Supabase
  const availableQuizzes: AvailableQuiz[] = [
    {
      id: '1',
      title: 'Basic Mathematics',
      description: 'Test your fundamental math skills',
      category: 'mathematics',
      difficulty: 'beginner',
      questionsCount: 10,
      timeLimit: 30,
      maxAttempts: 3,
      remainingAttempts: 3
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      description: 'Explore basic physics concepts',
      category: 'science',
      difficulty: 'intermediate',
      questionsCount: 15,
      timeLimit: 45,
      maxAttempts: 3,
      remainingAttempts: 2
    },
    {
      id: '3',
      title: 'Advanced Chemistry',
      description: 'Challenge yourself with complex chemistry',
      category: 'science',
      difficulty: 'advanced',
      questionsCount: 20,
      timeLimit: 60,
      maxAttempts: 2,
      remainingAttempts: 2
    }
  ];

  const completedQuizzes: CompletedQuiz[] = [
    {
      id: '1',
      title: 'Basic Mathematics',
      score: 85,
      maxScore: 100,
      timeTaken: 1800, // seconds
      completedAt: '2024-01-15',
      attempt: 1
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      score: 92,
      maxScore: 100,
      timeTaken: 2400,
      completedAt: '2024-01-12',
      attempt: 1
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = (quizId: string) => {
    console.log('Starting quiz:', quizId);
    // TODO: Navigate to quiz component
  };

  const totalCompleted = completedQuizzes.length;
  const totalAvailable = availableQuizzes.length;
  const avgScore = completedQuizzes.length > 0 
    ? Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes.length)
    : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('student')} {t('dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('welcomeMessage')} Track your progress and take new quizzes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="available">Quizzes</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="labs">Virtual Labs</TabsTrigger>
          <TabsTrigger value="completed">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  {totalAvailable - totalCompleted} remaining
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgScore}%</div>
                <Progress value={avgScore} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAvailable}</div>
                <p className="text-xs text-muted-foreground">
                  Ready to take
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setActiveTab('available')} 
                  className="w-full justify-start"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Quizzes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('games')}
                  className="w-full justify-start"
                >
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Educational Games
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('labs')}
                  className="w-full justify-start"
                >
                  <Microscope className="mr-2 h-4 w-4" />
                  Virtual Labs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {completedQuizzes.slice(0, 3).map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">{quiz.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Completed on {quiz.completedAt}
                      </div>
                    </div>
                    <Badge variant={quiz.score >= 80 ? "default" : "secondary"}>
                      {quiz.score}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{quiz.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.questionsCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit} mins</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Attempts:</span>
                        <span className="ml-1">{quiz.remainingAttempts}/{quiz.maxAttempts}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startQuiz(quiz.id)}
                    disabled={quiz.remainingAttempts === 0}
                    className="ml-4"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {t('startQuiz')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="games">
          <GameHub />
        </TabsContent>

        <TabsContent value="labs">
          <VirtualLab />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuizzes.map((quiz) => (
            <Card key={`${quiz.id}-${quiz.attempt}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      <Badge variant="outline">Attempt {quiz.attempt}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score:</span>
                        <span className="ml-1 font-medium">{quiz.score}/{quiz.maxScore}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1">{formatTime(quiz.timeTaken)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="ml-1">{quiz.completedAt}</span>
                      </div>
                      <div>
                        <Progress value={(quiz.score / quiz.maxScore) * 100} className="w-full" />
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={quiz.score >= 80 ? "default" : "secondary"}
                    className="ml-4 text-lg px-3 py-1"
                  >
                    {Math.round((quiz.score / quiz.maxScore) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
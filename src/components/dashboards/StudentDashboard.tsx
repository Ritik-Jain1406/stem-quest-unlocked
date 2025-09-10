import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  Star, 
  Target,
  PlayCircle,
  Clock,
  Award,
  Gamepad2,
  FlaskConical,
  Brain,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { GameHub } from '@/components/games/GameHub';
import { VirtualLab } from '@/components/VirtualLab';
import { LessonsHub } from '@/components/lessons/LessonsHub';
import { QuizHub } from '@/components/quiz/QuizHub';

interface StudentStats {
  totalXP: number;
  currentLevel: number;
  dailyStreak: number;
  coinsBalance: number;
  badgesEarned: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  labsCompleted: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'lab' | 'badge';
  title: string;
  xpGained: number;
  coinsGained: number;
  timestamp: Date;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    totalXP: 2450,
    currentLevel: 8,
    dailyStreak: 12,
    coinsBalance: 1250,
    badgesEarned: 15,
    lessonsCompleted: 24,
    quizzesCompleted: 18,
    labsCompleted: 8
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'quiz',
      title: 'Chemical Reactions Quiz',
      xpGained: 150,
      coinsGained: 50,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'lab',
      title: 'Physics Pendulum Lab',
      xpGained: 200,
      coinsGained: 75,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'badge',
      title: 'Chemistry Expert Badge',
      xpGained: 100,
      coinsGained: 100,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const getLevelProgress = () => {
    const currentLevelXP = (stats.currentLevel - 1) * 1000;
    const nextLevelXP = stats.currentLevel * 1000;
    const progressXP = stats.totalXP - currentLevelXP;
    const levelXPRange = nextLevelXP - currentLevelXP;
    return (progressXP / levelXPRange) * 100;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Brain className="h-4 w-4" />;
      case 'lab': return <FlaskConical className="h-4 w-4" />;
      case 'badge': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  if (activeTab === 'games') {
    return <GameHub onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'labs') {
    return <VirtualLab onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'lessons') {
    return <LessonsHub onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'quizzes') {
    return <QuizHub onBack={() => setActiveTab('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {user?.user_metadata?.name || 'Student'}! 👋
              </h1>
              <p className="text-muted-foreground">Ready to continue your STEM journey?</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 rounded-full">
                <Flame className="h-4 w-4 text-warning" />
                <span className="font-semibold text-warning">{stats.dailyStreak}</span>
                <span className="text-sm text-muted-foreground">day streak</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-full">
                <Trophy className="h-4 w-4 text-success" />
                <span className="font-semibold text-success">{stats.coinsBalance}</span>
                <span className="text-sm text-muted-foreground">coins</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Level Progress */}
          <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Level {stats.currentLevel}</h3>
                  <p className="text-sm text-muted-foreground">{stats.totalXP} XP earned</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{Math.round(getLevelProgress())}%</div>
                  <p className="text-xs text-muted-foreground">to next level</p>
                </div>
              </div>
              <Progress value={getLevelProgress()} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {1000 - (stats.totalXP % 1000)} XP until Level {stats.currentLevel + 1}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => setActiveTab('lessons')}
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-medium">Lessons</span>
              <span className="text-xs text-muted-foreground">{stats.lessonsCompleted} completed</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => setActiveTab('quizzes')}
            >
              <Brain className="h-6 w-6 text-success" />
              <span className="font-medium">Quizzes</span>
              <span className="text-xs text-muted-foreground">{stats.quizzesCompleted} completed</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => setActiveTab('labs')}
            >
              <FlaskConical className="h-6 w-6 text-warning" />
              <span className="font-medium">Virtual Labs</span>
              <span className="text-xs text-muted-foreground">{stats.labsCompleted} completed</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => setActiveTab('games')}
            >
              <Gamepad2 className="h-6 w-6 text-info" />
              <span className="font-medium">Games</span>
              <span className="text-xs text-muted-foreground">Play & Learn</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Organic Chemistry Basics</h4>
                        <p className="text-sm text-muted-foreground">Progress: 67% complete</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Brain className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <h4 className="font-medium">Physics Laws Quiz</h4>
                        <p className="text-sm text-muted-foreground">High score: 85%</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-warning" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="p-2 bg-warning/20 rounded-full">
                      <Award className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h5 className="font-medium text-warning">Chemistry Expert</h5>
                      <p className="text-xs text-muted-foreground">Completed 10 chemistry lessons</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="p-2 bg-success/20 rounded-full">
                      <Flame className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h5 className="font-medium text-success">Streak Master</h5>
                      <p className="text-xs text-muted-foreground">12 day learning streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quiz Average</span>
                    <span className="font-semibold text-success">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lab Completion</span>
                    <span className="font-semibold text-primary">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekly Goal</span>
                    <span className="font-semibold text-warning">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="p-1.5 bg-background rounded-md">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate">{activity.title}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          +{activity.xpGained} XP
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          +{activity.coinsGained} coins
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">Complete 3 Math Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn double XP and 100 bonus coins!
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={67} className="flex-1 h-2" />
                    <span className="text-sm font-medium">2/3</span>
                  </div>
                  <Button size="sm" className="w-full">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
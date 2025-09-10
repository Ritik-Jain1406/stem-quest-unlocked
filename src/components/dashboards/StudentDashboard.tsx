import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Zap, 
  Calendar,
  Star,
  Flame,
  Coins,
  Award,
  TrendingUp,
  Clock,
  Users,
  ChevronRight,
  Play,
  CheckCircle,
  Settings,
  LogOut,
  Gift,
  Brain,
  FlaskConical,
  Gamepad2
} from 'lucide-react';

// Import other components
import { LessonsHub } from '@/components/lessons/LessonsHub';
import { QuizHub } from '@/components/quiz/QuizHub';
import { VirtualLab } from '@/components/VirtualLab';
import { GameHub } from '@/components/games/GameHub';

interface StudentStats {
  xp: number;
  level: number;
  streak: number;
  coins: number;
  badges: number;
  completedQuizzes: number;
  totalQuizzes: number;
  studyTimeToday: number; // in minutes
  lastActive: string;
  joinedDate: string;
}

interface RecentActivity {
  id: string;
  type: 'quiz' | 'lab' | 'lesson' | 'achievement' | 'streak' | 'badge';
  title: string;
  xpGained: number;
  timestamp: string;
  category?: 'physics' | 'chemistry' | 'biology' | 'math' | 'computer';
  icon?: string;
  description?: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState<StudentStats>({
    xp: 1250,
    level: 8,
    streak: 12,
    coins: 450,
    badges: 6,
    completedQuizzes: 23,
    totalQuizzes: 45,
    studyTimeToday: 45,
    lastActive: new Date().toISOString(),
    joinedDate: '2024-01-15'
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'quiz',
      title: 'Chemical Bonding Quiz',
      xpGained: 50,
      timestamp: '2 hours ago',
      category: 'chemistry',
      icon: '🧪',
      description: 'Completed with 85% score'
    },
    {
      id: '2', 
      type: 'lab',
      title: 'Virtual Chemistry Lab',
      xpGained: 75,
      timestamp: '5 hours ago',
      category: 'chemistry',
      icon: '⚗️',
      description: 'Titration experiment completed'
    },
    {
      id: '3',
      type: 'badge',
      title: 'Quiz Master',
      xpGained: 100,
      timestamp: '1 day ago',
      icon: '🏆',
      description: 'Completed 10 quizzes with >80% score'
    },
    {
      id: '4',
      type: 'streak',
      title: '7-Day Streak!',
      xpGained: 50,
      timestamp: '1 day ago',
      icon: '🔥',
      description: 'Studied for 7 consecutive days'
    },
    {
      id: '5',
      type: 'lesson',
      title: 'Introduction to Organic Chemistry',
      xpGained: 25,
      timestamp: '2 days ago',
      category: 'chemistry',
      icon: '📚',
      description: 'Lesson completed'
    }
  ]);

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>({
    id: 'daily_1',
    title: 'Study Streak Champion',
    description: 'Complete 3 learning activities today',
    progress: 2,
    target: 3,
    reward: 100,
    completed: false
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserProfile(data);
      
      // Update stats with real data
      if (data) {
        setStats(prev => ({
          ...prev,
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.daily_streak || 0
        }));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const getLevelProgress = () => {
    const currentLevelXP = (stats.level - 1) * 1000;
    const nextLevelXP = stats.level * 1000;
    const progress = ((stats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const formatTimeAgo = (timestamp: string) => {
    return timestamp; // Already formatted in mock data
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'lab': return <FlaskConical className="h-4 w-4" />;
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'badge': return <Trophy className="h-4 w-4" />;
      case 'streak': return <Flame className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
      });
    }
  };

  // Handle navigation to different sections
  if (activeTab === 'lessons') {
    return <LessonsHub onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'quizzes') {
    return <QuizHub onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'labs') {
    return <VirtualLab onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'games') {
    return <GameHub onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    ZENITH LEARN
                  </h1>
                  <p className="text-sm text-muted-foreground">Student Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{stats.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{stats.coins} coins</span>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Avatar className="border-2 border-primary/20">
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{userProfile?.name || 'Student'}</p>
                  <p className="text-xs text-muted-foreground">Level {stats.level}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold">
              Welcome back, {userProfile?.name || 'Student'}! 👋
            </h2>
            <p className="text-muted-foreground text-lg">
              Ready to continue your STEM learning journey?
            </p>
          </div>

          {/* Level Progress */}
          <Card className="animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Level {stats.level}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.xp} / {stats.level * 1000} XP
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next Level</p>
                  <p className="text-lg font-semibold">{stats.level + 1}</p>
                </div>
              </div>
              <Progress value={getLevelProgress()} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {((stats.level * 1000) - stats.xp)} XP until next level
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveTab('lessons')}
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 animate-slide-in-right"
              style={{ animationDelay: '0.1s' }}
            >
              <BookOpen className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium">Lessons</span>
            </Button>

            <Button
              onClick={() => setActiveTab('quizzes')}
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/20 animate-slide-in-right"
              style={{ animationDelay: '0.2s' }}
            >
              <Target className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium">Quizzes</span>
            </Button>

            <Button
              onClick={() => setActiveTab('labs')}
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950/20 animate-slide-in-right"
              style={{ animationDelay: '0.3s' }}
            >
              <FlaskConical className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium">Virtual Labs</span>
            </Button>

            <Button
              onClick={() => setActiveTab('games')}
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-pink-50 hover:border-pink-200 dark:hover:bg-pink-950/20 animate-slide-in-right"
              style={{ animationDelay: '0.4s' }}
            >
              <Gamepad2 className="h-6 w-6 text-pink-500" />
              <span className="text-sm font-medium">Games</span>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Continue Learning */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Organic Chemistry</h4>
                            <p className="text-sm text-muted-foreground">Chapter 3: Alkenes</p>
                            <Progress value={65} className="h-2 mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md transition-shadow hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <FlaskConical className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Physics Lab</h4>
                            <p className="text-sm text-muted-foreground">Pendulum Motion</p>
                            <Progress value={30} className="h-2 mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                        <div className="text-lg">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">+{activity.xpGained} XP</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="space-y-6">
              {/* Your Performance */}
              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Your Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{stats.completedQuizzes}</div>
                      <div className="text-xs text-muted-foreground">Quizzes Done</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">{stats.badges}</div>
                      <div className="text-xs text-muted-foreground">Badges Earned</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quiz Completion</span>
                        <span>{Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100)}%</span>
                      </div>
                      <Progress value={(stats.completedQuizzes / stats.totalQuizzes) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Study Time Today</span>
                        <span>{stats.studyTimeToday} min</span>
                      </div>
                      <Progress value={(stats.studyTimeToday / 120) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Challenge */}
              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-orange-500" />
                    Daily Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{dailyChallenge.title}</h4>
                      <p className="text-sm text-muted-foreground">{dailyChallenge.description}</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{dailyChallenge.progress}/{dailyChallenge.target}</span>
                      </div>
                      <Progress value={(dailyChallenge.progress / dailyChallenge.target) * 100} className="h-3" />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                      <span className="text-sm font-medium">Reward</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">{dailyChallenge.reward}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-1 bg-muted rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          +{activity.xpGained}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
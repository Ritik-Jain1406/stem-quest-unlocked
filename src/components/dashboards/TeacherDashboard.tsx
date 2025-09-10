import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  PlusCircle, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FlaskConical,
  Brain,
  Upload,
  Settings,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ContentCreator } from '@/components/teacher/ContentCreator';
import { StudentProgress } from '@/components/teacher/StudentProgress';
import { ClassAnalytics } from '@/components/teacher/ClassAnalytics';

interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  avgCompletion: number;
  totalLessons: number;
  totalQuizzes: number;
  totalLabs: number;
}

interface RecentActivity {
  id: string;
  student: string;
  action: string;
  content: string;
  score?: number;
  timestamp: Date;
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState<ClassStats>({
    totalStudents: 34,
    activeStudents: 28,
    avgCompletion: 78,
    totalLessons: 12,
    totalQuizzes: 8,
    totalLabs: 5
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      student: 'Alex Chen',
      action: 'completed',
      content: 'Organic Chemistry Quiz',
      score: 92,
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      student: 'Emma Johnson',
      action: 'started',
      content: 'Physics Lab: Pendulum Motion',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: '3',
      student: 'Marcus Williams',
      action: 'completed',
      content: 'Algebra Fundamentals',
      score: 87,
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (activeTab === 'create') {
    return <ContentCreator onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'students') {
    return <StudentProgress onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'analytics') {
    return <ClassAnalytics onBack={() => setActiveTab('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.user_metadata?.name || 'Teacher'}! 👨‍🏫
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={() => setActiveTab('create')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.activeStudents} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Completion</p>
                  <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <Progress value={stats.avgCompletion} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Created</p>
                  <p className="text-2xl font-bold">{stats.totalLessons + stats.totalQuizzes + stats.totalLabs}</p>
                </div>
                <BookOpen className="h-8 w-8 text-warning" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalLessons} lessons, {stats.totalQuizzes} quizzes, {stats.totalLabs} labs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <BarChart3 className="h-8 w-8 text-info" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total submissions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
                    onClick={() => setActiveTab('create')}
                  >
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-medium">Create Lesson</span>
                    <span className="text-xs text-muted-foreground">Interactive content</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
                    onClick={() => setActiveTab('create')}
                  >
                    <Brain className="h-6 w-6 text-success" />
                    <span className="font-medium">Create Quiz</span>
                    <span className="text-xs text-muted-foreground">Assessment tools</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col gap-2 hover:scale-105 transition-transform"
                    onClick={() => setActiveTab('create')}
                  >
                    <FlaskConical className="h-6 w-6 text-warning" />
                    <span className="font-medium">Create Lab</span>
                    <span className="text-xs text-muted-foreground">Virtual experiments</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Organic Chemistry Series</h4>
                      <p className="text-sm text-muted-foreground">12 lessons • 89% completion rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Brain className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium">Physics Laws Assessment</h4>
                      <p className="text-sm text-muted-foreground">8 questions • 76% avg score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <FlaskConical className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pendulum Motion Lab</h4>
                      <p className="text-sm text-muted-foreground">Virtual experiment • 92% completion</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Quick Access */}
          <div className="space-y-6">
            {/* Class Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-success" />
                  Class Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Week 1</span>
                    <span className="font-semibold text-success">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Week 2</span>
                    <span className="font-semibold text-success">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Week 3</span>
                    <span className="font-semibold text-warning">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveTab('analytics')}
                >
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Student Activity */}
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
                      {activity.action === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium">{activity.student}</h5>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.action} {activity.content}
                      </p>
                      {activity.score && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Score: {activity.score}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveTab('students')}
                >
                  View All Students
                </Button>
              </CardContent>
            </Card>

            {/* Quick Upload */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Quick Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload existing materials and convert them to interactive content
                  </p>
                  <Button size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Supports PDF, DOCX, PPTX, and more
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
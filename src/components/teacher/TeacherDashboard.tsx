import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Users, BarChart3 } from 'lucide-react';
import { CreateQuizForm } from './CreateQuizForm';
import { QuizManagement } from './QuizManagement';
import { StudentProgress } from './StudentProgress';
import { useTranslation } from '@/hooks/useTranslation';

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('teacher')} {t('dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('welcomeMessage')} Manage your quizzes and track student progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">{t('createQuiz')}</TabsTrigger>
          <TabsTrigger value="manage">{t('manageQuizes')}</TabsTrigger>
          <TabsTrigger value="progress">{t('studentProgress')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">
                  +5 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last month
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
                  onClick={() => setActiveTab('create')} 
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('createQuiz')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('manage')}
                  className="w-full justify-start"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('manageQuizes')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('progress')}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View {t('studentProgress')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Math Quiz completed by 5 students</span>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Science Quiz created</span>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New student enrolled</span>
                    <span className="text-xs text-muted-foreground">2d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <CreateQuizForm />
        </TabsContent>

        <TabsContent value="manage">
          <QuizManagement />
        </TabsContent>

        <TabsContent value="progress">
          <StudentProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAppContext } from '@/contexts/AppContext';
import { Dashboard } from '@/components/Dashboard';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { Settings } from '@/components/Settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings as SettingsIcon, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

const Index = () => {
  const { user, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const { userRole, isLoading: contextLoading } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  
  const {
    userData,
    userProgressData,
    quests,
    isLoading: dataLoading,
    completeQuest,
    completeLab
  } = useSupabaseData();

  if (authLoading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-transparent">
        <div className="text-center space-y-6 max-w-lg mx-auto p-6">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-primary">ZEINTH LEARN</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {t('welcomeMessage')}
          </p>
          <p className="text-muted-foreground">
            Join thousands of students and teachers exploring Science, Technology, Engineering, and Mathematics through interactive quizzes and learning experiences.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="mt-6"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderMainContent = () => {
    if (currentView === 'settings') {
      return <Settings />;
    }

    if (userRole === 'teacher') {
      return <TeacherDashboard />;
    } else if (userRole === 'student') {
      return <StudentDashboard />;
    } else {
      // Fallback to original dashboard for existing users
      if (userData && userProgressData && quests) {
        return (
          <Dashboard
            quests={quests}
            userProgress={userProgressData}
            onCompleteQuest={completeQuest}
            onCompleteLab={completeLab}
          />
        );
      }
    }

    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t('loading')}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">ZEINTH LEARN</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {userData?.name || user.email}
            </span>
            {userRole && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {t(userRole as any)}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              <User className="h-4 w-4 mr-2" />
              {t('dashboard')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentView('settings')}
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              {t('settings')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {dataLoading && currentView === 'dashboard' ? (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-4 w-full max-w-md mx-auto">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          renderMainContent()
        )}
      </main>
    </div>
  );
};

export default Index;
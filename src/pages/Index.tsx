import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Beaker, Users, Trophy, BookOpen, Play, User, LogOut, LogIn } from "lucide-react";
import { Dashboard } from '@/components/Dashboard';
import { UserProfile } from '@/components/UserProfile';
import { Leaderboard } from '@/components/Leaderboard';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'leaderboard'>('dashboard');
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const { user, progress, quests, isLoading, completeQuest, completeLab } = useSupabaseData();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-science via-technology to-engineering flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-science via-technology to-engineering">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/aad96ff8-0233-413a-b3c3-417338d1ea29.png" 
                alt="ZEINTH LEARN Logo" 
                className="h-12 w-auto"
              />
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-white/90"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </header>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Explore the World of
              <span className="block bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                STEM Learning
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Embark on interactive quests, conduct virtual experiments, solve coding challenges, 
              and unlock the secrets of Science, Technology, Engineering, and Mathematics.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              Start Your Adventure
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-white">Interactive Quests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Engaging storylines that make learning fun and memorable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <Beaker className="h-8 w-8 text-science mb-2" />
                <CardTitle className="text-white">Virtual Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Safe, virtual experiments and simulations for hands-on learning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <Trophy className="h-8 w-8 text-warning mb-2" />
                <CardTitle className="text-white">Gamification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Earn XP, unlock badges, and compete with other learners.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <Users className="h-8 w-8 text-engineering mb-2" />
                <CardTitle className="text-white">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Connect with fellow STEM enthusiasts and learn together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-science via-technology to-engineering flex items-center justify-center">
        <div className="text-white text-xl">Setting up your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-science via-technology to-engineering">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/aad96ff8-0233-413a-b3c3-417338d1ea29.png" 
              alt="ZEINTH LEARN Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80">Welcome, {user.name}!</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveView('dashboard')}
            className={activeView === 'dashboard' ? '' : 'text-white hover:bg-white/10'}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Quests
          </Button>
          <Button
            variant={activeView === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveView('profile')}
            className={activeView === 'profile' ? '' : 'text-white hover:bg-white/10'}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeView === 'leaderboard' ? 'default' : 'ghost'}
            onClick={() => setActiveView('leaderboard')}
            className={activeView === 'leaderboard' ? '' : 'text-white hover:bg-white/10'}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {activeView === 'dashboard' && (
              <Dashboard
                quests={quests}
                userProgress={progress}
                onCompleteQuest={completeQuest}
                onCompleteLab={completeLab}
              />
            )}
            {activeView === 'leaderboard' && (
              <Leaderboard currentUser={user} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            {activeView === 'profile' ? (
              <UserProfile user={user} progress={progress} />
            ) : (
              <div className="space-y-6">
                <UserProfile user={user} progress={progress} />
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/80">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Quests:</span>
                        <Badge variant="secondary">{quests.filter(q => !q.isCompleted).length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <Badge variant="secondary">{progress.questsCompleted.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total XP:</span>
                        <Badge variant="secondary">{progress.totalXP}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
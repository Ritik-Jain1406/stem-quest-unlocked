import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/auth/AuthPage';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { TeacherDashboard } from '@/components/dashboards/TeacherDashboard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  role: 'student' | 'teacher' | 'admin';
  name: string;
  email: string;
  xp?: number;
  level?: number;
  daily_streak?: number;
}

export function ZenithApp() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        console.log('No profile found, creating default profile');
        // Create a default profile if none exists
        const newProfile = {
          user_id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          role: 'student',
          xp: 0,
          level: 1,
          daily_streak: 0
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (!insertError && insertedProfile) {
          setUserProfile({
            role: insertedProfile.role as 'student' | 'teacher' | 'admin',
            name: insertedProfile.name,
            email: insertedProfile.email,
            xp: insertedProfile.xp,
            level: insertedProfile.level,
            daily_streak: insertedProfile.daily_streak
          });

          toast({
            title: "🎉 Welcome to ZENITH LEARN!",
            description: `Your ${insertedProfile.role} account has been set up successfully.`,
          });
        } else {
          console.error('Error creating profile:', insertError);
        }
        return;
      }

      // Profile exists, set it
      setUserProfile({
        role: data.role as 'student' | 'teacher' | 'admin',
        name: data.name,
        email: data.email,
        xp: data.xp,
        level: data.level,
        daily_streak: data.daily_streak
      });

    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Loading ZENITH LEARN
            </h2>
            <p className="text-muted-foreground">Preparing your learning environment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Route to appropriate dashboard based on role
  switch (userProfile?.role) {
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <TeacherDashboard />; // Admin uses enhanced teacher dashboard
    default:
      return <StudentDashboard />;
  }
}
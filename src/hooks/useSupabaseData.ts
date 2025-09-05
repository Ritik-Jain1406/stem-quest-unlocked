import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Quest, Lab, UserProgress, Badge } from '@/types/stem';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  level: number;
  xp: number;
  daily_streak: number;
  last_active_date: string;
}

export function useSupabaseData() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [labProgress, setLabProgress] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch quests with labs
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const { data: questsData, error: questsError } = await supabase
          .from('quests')
          .select(`
            *,
            labs (
              *,
              quiz_questions (*),
              simulation_configs (*),
              code_challenges (*)
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (questsError) {
          console.error('Error fetching quests:', questsError);
          return;
        }

        // Transform data to match our Quest interface
        const transformedQuests: Quest[] = questsData.map((quest: any) => ({
          id: quest.id,
          title: quest.title,
          description: quest.description,
          category: quest.category,
          difficulty: quest.difficulty,
          xpReward: quest.xp_reward,
          estimatedTime: quest.estimated_time,
          prerequisites: quest.prerequisites || [],
          labs: quest.labs.map((lab: any) => ({
            id: lab.id,
            title: lab.title,
            description: lab.description,
            type: lab.type,
            content: {
              instructions: lab.instructions,
              materials: lab.materials || [],
              steps: lab.steps || [],
              questions: lab.quiz_questions || [],
              simulation: lab.simulation_configs?.[0] ? {
                type: lab.simulation_configs[0].simulation_type,
                parameters: lab.simulation_configs[0].parameters,
              } : undefined,
              code: lab.code_challenges?.[0] ? {
                language: lab.code_challenges[0].language,
                starterCode: lab.code_challenges[0].starter_code,
                expectedOutput: lab.code_challenges[0].expected_output,
                testCases: lab.code_challenges[0].test_cases || [],
              } : undefined,
            },
            isCompleted: false,
          })),
          isCompleted: false,
        }));

        setQuests(transformedQuests);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };

    fetchQuests();
  }, []);

  // Fetch user progress
  useEffect(() => {
    if (!user) {
      setUserProgress([]);
      setLabProgress([]);
      setUserBadges([]);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch quest progress
        const { data: questProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        setUserProgress(questProgress || []);

        // Fetch lab progress
        const { data: labProgressData } = await supabase
          .from('lab_progress')
          .select('*')
          .eq('user_id', user.id);

        setLabProgress(labProgressData || []);

        // Fetch user badges
        const { data: badges } = await supabase
          .from('user_badges')
          .select(`
            *,
            badges (*)
          `)
          .eq('user_id', user.id);

        setUserBadges(badges?.map((ub: any) => ub.badges) || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const completeQuest = async (questId: string) => {
    if (!user) return;

    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest) return;

      // Insert or update quest progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          is_completed: true,
          completed_at: new Date().toISOString(),
        });

      if (progressError) {
        console.error('Error updating quest progress:', progressError);
        toast.error('Failed to complete quest');
        return;
      }

      // Update user XP
      const { error: xpError } = await supabase.rpc('update_user_xp', {
        user_uuid: user.id,
        xp_to_add: quest.xpReward,
      });

      if (xpError) {
        console.error('Error updating XP:', xpError);
      }

      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile);
      }

      toast.success(`Quest completed! +${quest.xpReward} XP`);
    } catch (error) {
      console.error('Error completing quest:', error);
      toast.error('Failed to complete quest');
    }
  };

  const completeLab = async (labId: string, questId: string, score?: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lab_progress')
        .upsert({
          user_id: user.id,
          lab_id: labId,
          quest_id: questId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          score: score || 0,
          attempts: 1,
        });

      if (error) {
        console.error('Error updating lab progress:', error);
        toast.error('Failed to complete lab');
        return;
      }

      toast.success('Lab completed!');
    } catch (error) {
      console.error('Error completing lab:', error);
      toast.error('Failed to complete lab');
    }
  };

  // Create user-friendly progress data
  const userProgressData = profile ? {
    questsCompleted: userProgress.filter(p => p.is_completed).map(p => p.quest_id),
    labsCompleted: labProgress.filter(p => p.is_completed).map(p => p.lab_id),
    totalXP: profile.xp,
    currentLevel: profile.level,
    badges: userBadges,
    dailyStreak: profile.daily_streak,
    lastActiveDate: new Date(profile.last_active_date),
  } : null;

  // Create user data
  const userData = profile ? {
    id: profile.user_id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar_url,
    level: profile.level,
    xp: profile.xp,
    badges: userBadges,
    createdAt: new Date(),
  } : null;

  return {
    user: userData,
    profile,
    progress: userProgressData,
    quests,
    isLoading: isLoading || !isAuthenticated,
    completeQuest,
    completeLab,
  };
}
import { useState, useEffect } from 'react';
import { User, UserProgress, Quest } from '@/types/stem';
import { LocalStorage } from '@/lib/storage';
import { DEMO_QUESTS } from '@/data/quests';

export function useLocalStorage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize data from localStorage
    const storedUser = LocalStorage.getUser();
    const storedProgress = LocalStorage.getProgress();
    const storedQuests = LocalStorage.getQuests();

    setUser(storedUser);
    setProgress(storedProgress);
    
    // Initialize with demo quests if no quests exist
    if (storedQuests.length === 0) {
      LocalStorage.setQuests(DEMO_QUESTS);
      setQuests(DEMO_QUESTS);
    } else {
      setQuests(storedQuests);
    }
    
    setIsLoading(false);
  }, []);

  const createUser = (userData: Omit<User, 'id' | 'level' | 'xp' | 'badges' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      level: 1,
      xp: 0,
      badges: [],
      createdAt: new Date(),
    };

    const newProgress: UserProgress = {
      questsCompleted: [],
      labsCompleted: [],
      totalXP: 0,
      currentLevel: 1,
      badges: [],
      dailyStreak: 1,
      lastActiveDate: new Date(),
    };

    LocalStorage.setUser(newUser);
    LocalStorage.setProgress(newProgress);
    
    setUser(newUser);
    setProgress(newProgress);
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted) return;

    LocalStorage.updateQuestCompletion(questId, true);
    LocalStorage.addXP(quest.xpReward);

    // Update local state
    setQuests(prev => prev.map(q => 
      q.id === questId 
        ? { ...q, isCompleted: true, completedAt: new Date() }
        : q
    ));

    if (progress) {
      setProgress(prev => prev ? {
        ...prev,
        questsCompleted: [...prev.questsCompleted, questId],
        totalXP: prev.totalXP + quest.xpReward,
        currentLevel: Math.floor((prev.totalXP + quest.xpReward) / 1000) + 1,
        lastActiveDate: new Date(),
      } : null);
    }
  };

  const completeLab = (labId: string, score?: number) => {
    LocalStorage.updateLabCompletion(labId, true, score);
    
    // Update local state
    setQuests(prev => prev.map(quest => ({
      ...quest,
      labs: quest.labs.map(lab => 
        lab.id === labId 
          ? { ...lab, isCompleted: true, completedAt: new Date(), score }
          : lab
      ),
    })));

    if (progress) {
      setProgress(prev => prev ? {
        ...prev,
        labsCompleted: [...prev.labsCompleted, labId],
        lastActiveDate: new Date(),
      } : null);
    }
  };

  const resetProgress = () => {
    LocalStorage.clearAll();
    setUser(null);
    setProgress(null);
    setQuests(DEMO_QUESTS);
    LocalStorage.setQuests(DEMO_QUESTS);
  };

  return {
    user,
    progress,
    quests,
    isLoading,
    createUser,
    completeQuest,
    completeLab,
    resetProgress,
  };
}
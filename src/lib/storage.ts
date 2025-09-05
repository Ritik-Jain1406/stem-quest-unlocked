import { User, UserProgress, Quest, Lab } from '@/types/stem';

const STORAGE_KEYS = {
  USER: 'stem_user',
  PROGRESS: 'stem_progress',
  QUESTS: 'stem_quests',
  LABS: 'stem_labs',
  LEADERBOARD: 'stem_leaderboard',
} as const;

export class LocalStorage {
  static getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    user.createdAt = new Date(user.createdAt);
    return user;
  }

  static setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getProgress(): UserProgress | null {
    const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!progressData) return null;
    
    const progress = JSON.parse(progressData);
    progress.lastActiveDate = new Date(progress.lastActiveDate);
    return progress;
  }

  static setProgress(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }

  static getQuests(): Quest[] {
    const questsData = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!questsData) return [];
    
    const quests = JSON.parse(questsData);
    return quests.map((quest: any) => ({
      ...quest,
      completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
    }));
  }

  static setQuests(quests: Quest[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }

  static updateQuestCompletion(questId: string, completed: boolean): void {
    const quests = this.getQuests();
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex !== -1) {
      quests[questIndex].isCompleted = completed;
      if (completed) {
        quests[questIndex].completedAt = new Date();
      }
      this.setQuests(quests);
    }
  }

  static updateLabCompletion(labId: string, completed: boolean, score?: number): void {
    const quests = this.getQuests();
    for (const quest of quests) {
      const lab = quest.labs.find(l => l.id === labId);
      if (lab) {
        lab.isCompleted = completed;
        if (completed) {
          lab.completedAt = new Date();
          lab.score = score;
        }
        break;
      }
    }
    this.setQuests(quests);
  }

  static addXP(amount: number): void {
    const progress = this.getProgress();
    if (!progress) return;

    progress.totalXP += amount;
    progress.currentLevel = Math.floor(progress.totalXP / 1000) + 1;
    progress.lastActiveDate = new Date();
    
    this.setProgress(progress);
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
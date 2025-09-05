export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: Badge[];
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: STEMCategory;
  earnedAt: Date;
}

export type STEMCategory = 'science' | 'technology' | 'engineering' | 'mathematics';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: STEMCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number; // in minutes
  labs: Lab[];
  prerequisites?: string[];
  isCompleted: boolean;
  completedAt?: Date;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  type: 'simulation' | 'experiment' | 'coding' | 'quiz';
  content: LabContent;
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
}

export interface LabContent {
  instructions: string;
  materials?: string[];
  steps?: string[];
  questions?: Question[];
  simulation?: SimulationConfig;
  code?: CodeChallenge;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SimulationConfig {
  type: 'physics' | 'chemistry' | 'biology' | 'math';
  parameters: Record<string, any>;
}

export interface CodeChallenge {
  language: string;
  starterCode: string;
  expectedOutput: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface UserProgress {
  questsCompleted: string[];
  labsCompleted: string[];
  totalXP: number;
  currentLevel: number;
  badges: Badge[];
  dailyStreak: number;
  lastActiveDate: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: Badge[];
  rank: number;
}

export interface Word {
  id: number;
  word: string;
  meaning: string;
  level: number;
}

export interface StoryLine {
  id: number;
  malay: string;
  chinese: string;
  audioText: string;
  type: 'vocab' | 'sentence';
  isName?: boolean; // To identify names like Sara to exclude from distractors if needed
}

export interface StoryChapter {
  id: number;
  title: string;
  content: StoryLine[];
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  maxUnlockedLevel: number; // Tracks Story Chapter
  stars: Record<string, number>; // key format: "chapterId-subLevelId"
  scores: Record<number, number>; 
  mistakes: number[];
  // Runtime properties for versus mode
  score?: number;
  hp?: number;
  isComputer?: boolean;
}

export interface World {
  id: number;
  name: string;
  enemy: string;
  hp: number;
  img: string;
  theme: string;
  bgPattern: string;
  desc: string;
  textColor: string;
}

export interface VersusConfig {
  p1: Player;
  p2: Player;
  words: Word[];
  mode: 'RACE_TO_10' | 'TIME_ATTACK';
  difficultyAI: 'EASY' | 'MEDIUM' | 'HARD';
}

export type AppState = 
  | 'SPLASH' 
  | 'USER_SELECT' 
  | 'MENU' 
  | 'STORY_SELECT' 
  | 'SUBLEVEL_SELECT' 
  | 'STORY_GAME'
  | 'LEADERBOARD_VIEW'
  | 'MISTAKE_REVIEW'
  | 'VERSUS_SETUP' 
  | 'VERSUS_GAME' 
  | 'RESULT';

export type BattleMode = 'QUIZ' | 'MATCH';

export interface LeaderboardEntry {
  playerName: string;
  avatar: string;
  timeMs: number;
  score: number;
  date: number;
}

export interface VersusLeaderboardEntry {
  playerName: string;
  avatar: string;
  wins: number;
  lastPlayed: number;
}

export interface BattleResult {
  status: 'WIN' | 'LOSE';
  stars: number;
  timeMs?: number;
  score?: number;
}

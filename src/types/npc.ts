import type { QuizOption } from '../constants/quizQuestions';

export interface BehavioralMetrics {
  movementRandomness: number;    // 0 - 100% (High = chaotic/human, Low = predictable)
  pathRepetition: number;        // 0 - 100% (High = looping back and forth)
  idleBehavior: number;          // 0 - 100% (High = stationary waiting for player)
  directionChanges: number;      // 0 - 100% (Rate of vector angle shifts)
  activityLevel: number;         // 0 - 100% (Overall pixel energy delta)
  movementRepetition: number;    // 0 - 100% (Repetitive cyclic micro-movement)
  predictability: number;        // 0 - 100% (Trajectory model certainty)
  loopDetected: boolean;         // True if spatial cycle threshold reached
  
  // Multi-Vector Biometric & Latency Enhancements
  kineticVarianceScore?: number;        // 0.0 - 100.0%
  conversationalEntropyScore?: number; // 0.0 - 100.0%
  environmentalComplianceRating?: number; // 0.0 - 100.0%
  rogueProtagonistPotentialIndex?: number; // 0.0 - 100.0%
  reactionLatencyMs?: number;          // Milliseconds (e.g. 482.4ms)
  decisionParalysisIndex?: number;     // 0 - 100%
  diagnosticConfidence?: number;       // 0.0 - 100.0% (e.g. 98.4%)
  headPositionStability?: number;      // 0 - 100%
  microBlinkingRate?: number;          // Blinks per minute equivalent
}

export type NPCLevel =
  | 'MAIN CHARACTER'
  | 'UNPREDICTABLE HUMAN'
  | 'BACKGROUND EXTRA'
  | 'COMMON NPC'
  | 'HIGH LEVEL NPC'
  | 'FINAL BOSS NPC';

export type NPCType =
  | 'BACKGROUND CHARACTER'
  | 'LOOPING NPC'
  | 'IDLE NPC'
  | 'WANDERING NPC'
  | 'QUEST NPC'
  | 'MERCHANT NPC'
  | 'CONFUSED NPC'
  | 'GUARD NPC'
  | 'CUTSCENE NPC'
  | 'COMMON NPC'
  | 'BACKGROUND EXTRA'
  | 'HIGH LEVEL NPC'
  | 'FINAL BOSS NPC'
  | 'MAIN CHARACTER';

export interface SubScores {
  kineticVariance: number;          // Kinetic Variance Score %
  conversationalEntropy: number;   // Conversational Entropy Score %
  environmentalCompliance: number; // Environmental Compliance Rating %
  rogueProtagonistIndex: number;   // Rogue Protagonist Potential Index %
}

export interface ScanResult {
  id: string;
  timestamp: number;
  subjectCode: string;
  npcScore: number;
  npcLevel: NPCLevel;
  npcType: NPCType;
  mainCharacterPotential: number;
  mainCharacterReason: string;
  metrics: BehavioralMetrics;
  subScores?: SubScores;
  reactionLatencyMs?: number;
  decisionParalysisIndex?: number;
  diagnosticConfidence?: number;
  behaviorSummary: string;
  observations: string[];
  scanDuration: number;
  snapshotDataUrl?: string;
  customName?: string;
  quizAnswers?: Record<number, QuizOption>;
  assessmentMode: 'quiz' | 'biometric' | 'hybrid';
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'behavior' | 'score' | 'time' | 'secret' | 'quiz';
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  name: string;
  npcScore: number;
  npcLevel: NPCLevel;
  npcType: NPCType;
  timestamp: number;
  avatarSeed?: string;
  isCustom?: boolean;
  assessmentMode?: string;
}

export interface SampleProfile {
  id: string;
  name: string;
  tagline: string;
  npcType: NPCType;
  npcLevel: NPCLevel;
  targetScore: number;
  metrics: BehavioralMetrics;
  observations: string[];
  mainCharacterReason: string;
  description: string;
}

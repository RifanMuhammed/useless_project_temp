export interface BehavioralMetrics {
  movementRandomness: number;    // 0 - 100% (High = chaotic/human, Low = predictable)
  pathRepetition: number;        // 0 - 100% (High = looping back and forth)
  idleBehavior: number;          // 0 - 100% (High = stationary waiting for player)
  directionChanges: number;      // 0 - 100% (Rate of vector angle shifts)
  activityLevel: number;         // 0 - 100% (Overall pixel energy delta)
  movementRepetition: number;    // 0 - 100% (Repetitive cyclic micro-movement)
  predictability: number;        // 0 - 100% (Trajectory model certainty)
  loopDetected: boolean;         // True if spatial cycle threshold reached
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
  | 'FINAL BOSS NPC';

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
  behaviorSummary: string;
  observations: string[];
  scanDuration: number;
  snapshotDataUrl?: string;
  customName?: string;
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
  category: 'behavior' | 'score' | 'time' | 'secret';
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

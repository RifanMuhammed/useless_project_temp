import type { BehavioralMetrics, NPCLevel, NPCType, ScanResult } from '../types/npc';
import { FUNNY_OBSERVATIONS_POOL } from '../constants/classifications';

export interface ScoringWeights {
  pathRepetition: number;
  idleBehavior: number;
  movementRepetition: number;
  predictability: number;
  lowRandomness: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  pathRepetition: 0.30,
  idleBehavior: 0.20,
  movementRepetition: 0.20,
  predictability: 0.20,
  lowRandomness: 0.10,
};

export class ScoringEngine {
  private weights: ScoringWeights = DEFAULT_WEIGHTS;

  constructor(weights?: Partial<ScoringWeights>) {
    if (weights) {
      this.weights = { ...DEFAULT_WEIGHTS, ...weights };
    }
  }

  /**
   * Calculate final NPC Score (0 - 100) from observable movement metrics
   */
  public calculateNPCScore(metrics: BehavioralMetrics): number {
    const lowRandomness = Math.max(0, 100 - metrics.movementRandomness);

    const rawScore =
      metrics.pathRepetition * this.weights.pathRepetition +
      metrics.idleBehavior * this.weights.idleBehavior +
      metrics.movementRepetition * this.weights.movementRepetition +
      metrics.predictability * this.weights.predictability +
      lowRandomness * this.weights.lowRandomness;

    // Clamp between 0 and 100
    return Math.round(Math.min(100, Math.max(0, rawScore)));
  }

  /**
   * Determine NPC Level based on score
   */
  public determineNPCLevel(score: number): NPCLevel {
    if (score <= 20) return 'MAIN CHARACTER';
    if (score <= 40) return 'UNPREDICTABLE HUMAN';
    if (score <= 60) return 'BACKGROUND EXTRA';
    if (score <= 80) return 'COMMON NPC';
    if (score <= 95) return 'HIGH LEVEL NPC';
    return 'FINAL BOSS NPC';
  }

  /**
   * Determine NPC Type based on metric dominance
   */
  public determineNPCType(metrics: BehavioralMetrics, score: number): NPCType {
    if (score >= 96) {
      return 'FINAL BOSS NPC';
    }
    if (metrics.movementRandomness >= 80 && score <= 25) {
      return 'BACKGROUND CHARACTER'; // Or Main Character equivalent
    }
    if (metrics.pathRepetition >= 75 && metrics.loopDetected) {
      return 'LOOPING NPC';
    }
    if (metrics.idleBehavior >= 75 && metrics.activityLevel < 25) {
      return 'IDLE NPC';
    }
    if (metrics.directionChanges >= 70 && metrics.activityLevel >= 55 && metrics.pathRepetition < 45) {
      return 'WANDERING NPC';
    }
    if (metrics.idleBehavior >= 50 && metrics.movementRepetition >= 60) {
      return 'QUEST NPC';
    }
    if (metrics.idleBehavior >= 65 && metrics.activityLevel <= 35) {
      return 'GUARD NPC';
    }
    if (metrics.directionChanges >= 75 && metrics.predictability <= 35) {
      return 'CONFUSED NPC';
    }
    if (metrics.activityLevel >= 65 && metrics.movementRepetition >= 50) {
      return 'MERCHANT NPC';
    }
    return 'BACKGROUND CHARACTER';
  }

  /**
   * Calculate Main Character Potential percentage and witty explanation
   */
  public calculateMainCharacterPotential(metrics: BehavioralMetrics, score: number): {
    percentage: number;
    reason: string;
  } {
    // Formula: Inversely related to NPC score, boosted by randomness and low repetition
    const basePotential = (100 - score) * 0.7 + (metrics.movementRandomness * 0.25) - (metrics.pathRepetition * 0.15);
    const clampedPotential = Number(Math.min(99.4, Math.max(1.2, basePotential)).toFixed(1));

    let reason = 'Subject demonstrates insufficient randomness for protagonist status.';
    if (clampedPotential >= 80) {
      reason = 'Extreme kinetic variance detected. System flagged subject as high-priority protagonist.';
    } else if (clampedPotential >= 55) {
      reason = 'Occasional breaks from scripted pathfinding. May be eligible for side-quest protagonist.';
    } else if (clampedPotential >= 35) {
      reason = 'Subject exhibits borderline awareness of free will, but remains within safe parameters.';
    } else if (metrics.idleBehavior >= 80) {
      reason = 'Stillness index too high. Protagonists rarely stay this still unless AFK.';
    } else if (metrics.pathRepetition >= 80) {
      reason = 'Path repetition exceeds 80%. Protagonists jump over fences rather than patrol them.';
    } else if (score >= 90) {
      reason = 'Subject shows zero protagonist traits. Perfectly optimized for background render budget.';
    }

    return {
      percentage: clampedPotential,
      reason,
    };
  }

  /**
   * Generate 3 - 5 hilarious, metric-driven observations
   */
  public generateObservations(metrics: BehavioralMetrics, score: number): string[] {
    const selected: string[] = [];

    // Idle observation
    if (metrics.idleBehavior >= 60) {
      const pool = FUNNY_OBSERVATIONS_POOL.highIdle;
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    // Path repetition observation
    if (metrics.pathRepetition >= 50 || metrics.loopDetected) {
      const pool = FUNNY_OBSERVATIONS_POOL.highRepetition;
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    // Randomness observation
    if (metrics.movementRandomness <= 35) {
      const pool = FUNNY_OBSERVATIONS_POOL.lowRandomness;
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    } else if (metrics.movementRandomness >= 70) {
      const pool = FUNNY_OBSERVATIONS_POOL.highRandomness;
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    // General observations to fill up to 3 - 4 items
    const generalPool = [...FUNNY_OBSERVATIONS_POOL.general];
    // Shuffle general pool
    for (let i = generalPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generalPool[i], generalPool[j]] = [generalPool[j], generalPool[i]];
    }

    for (const item of generalPool) {
      if (selected.length >= 4) break;
      if (!selected.includes(item)) {
        selected.push(item);
      }
    }

    // Add score-specific punchline
    if (score >= 90 && !selected.some(s => s.includes('Skyrim') || s.includes('dialogue'))) {
      selected.push('Subject would comfortably blend into Skyrim with zero texture mods.');
    } else if (score <= 20) {
      selected.push('Warning: Player character behavior may disrupt ambient crowd simulation.');
    }

    return selected.slice(0, 4);
  }

  /**
   * Build complete ScanResult object
   */
  public compileScanResult(
    metrics: BehavioralMetrics,
    scanDurationSeconds: number,
    snapshotDataUrl?: string
  ): ScanResult {
    const npcScore = this.calculateNPCScore(metrics);
    const npcLevel = this.determineNPCLevel(npcScore);
    const npcType = this.determineNPCType(metrics, npcScore);
    const { percentage: mainCharacterPotential, reason: mainCharacterReason } =
      this.calculateMainCharacterPotential(metrics, npcScore);
    const observations = this.generateObservations(metrics, npcScore);

    const subjectNum = Math.floor(1000 + Math.random() * 9000);
    const subjectCode = `SUB-${subjectNum}`;

    let behaviorSummary = `Subject exhibited ${metrics.idleBehavior}% idle behavior and ${metrics.pathRepetition}% path repetition across a ${scanDurationSeconds.toFixed(1)}s observation window.`;
    if (npcScore >= 80) {
      behaviorSummary = `High predictability index detected. Subject demonstrated standard automated background behavior.`;
    } else if (npcScore <= 25) {
      behaviorSummary = `Extreme behavioral entropy detected. Subject failed standard NPC obedience tests.`;
    }

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      subjectCode,
      npcScore,
      npcLevel,
      npcType,
      mainCharacterPotential,
      mainCharacterReason,
      metrics,
      behaviorSummary,
      observations,
      scanDuration: scanDurationSeconds,
      snapshotDataUrl,
    };
  }
}

export const scoringEngine = new ScoringEngine();

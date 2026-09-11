import type { BehavioralMetrics, NPCLevel, NPCType, ScanResult } from '../types/npc';
import type { QuizOption } from '../constants/quizQuestions';
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
   * Calculate score from Quiz Answers
   */
  public calculateQuizScore(answers: Record<number, QuizOption>): {
    score: number;
    dominantType: NPCType;
    observations: string[];
  } {
    const options = Object.values(answers);
    if (options.length === 0) {
      return { score: 50, dominantType: 'COMMON NPC', observations: [] };
    }

    const maxPerQuestion = 35;
    const totalMax = options.length * maxPerQuestion;
    const totalRaw = options.reduce((sum, opt) => sum + opt.scoreContribution, 0);

    const normalizedScore = Math.round(Math.min(100, Math.max(0, (totalRaw / totalMax) * 100)));

    // Count archetype occurrences
    const typeCounts: Record<string, number> = {};
    options.forEach((opt) => {
      typeCounts[opt.npcType] = (typeCounts[opt.npcType] || 0) + 1;
    });

    let dominantType: NPCType = options[0].npcType;
    let maxCount = 0;
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type as NPCType;
      }
    }

    // If score is extreme, override dominant type
    if (normalizedScore <= 20) {
      dominantType = 'MAIN CHARACTER';
    } else if (normalizedScore >= 96) {
      dominantType = 'FINAL BOSS NPC';
    }

    // Collect observation flavors
    const observations = options
      .map((opt) => opt.observationFlavor)
      .filter(Boolean)
      .slice(0, 4);

    return {
      score: normalizedScore,
      dominantType,
      observations,
    };
  }

  /**
   * Calculate Main Character Potential percentage and witty explanation
   */
  public calculateMainCharacterPotential(score: number, dominantType: NPCType): {
    percentage: number;
    reason: string;
  } {
    const rawPotential = 100 - score + (dominantType === 'MAIN CHARACTER' ? 15 : -5);
    const clampedPotential = Number(Math.min(99.4, Math.max(1.2, rawPotential)).toFixed(1));

    let reason = 'Subject demonstrates insufficient randomness for protagonist status.';
    if (clampedPotential >= 80) {
      reason = 'Extreme kinetic & psychological variance. Rogue protagonist status confirmed.';
    } else if (clampedPotential >= 55) {
      reason = 'Occasional breaks from scripted pathfinding. May be eligible for side-quest protagonist.';
    } else if (clampedPotential >= 35) {
      reason = 'Subject exhibits borderline awareness of free will, but remains within safe background bounds.';
    } else if (score >= 90) {
      reason = 'Subject shows zero protagonist traits. Perfectly optimized for ambient background render budget.';
    }

    return {
      percentage: clampedPotential,
      reason,
    };
  }

  /**
   * Compile Complete Multi-Factor Scan Result
   */
  public compileQuizResult(
    answers: Record<number, QuizOption>,
    biometricMetrics?: BehavioralMetrics,
    snapshotDataUrl?: string
  ): ScanResult {
    const { score: quizScore, dominantType, observations: quizObservations } = this.calculateQuizScore(answers);

    let finalScore = quizScore;
    let metrics: BehavioralMetrics = {
      movementRandomness: Math.max(5, 100 - quizScore),
      pathRepetition: Math.min(95, quizScore + 5),
      idleBehavior: Math.min(95, quizScore),
      directionChanges: Math.max(10, 100 - quizScore),
      activityLevel: 50,
      movementRepetition: quizScore,
      predictability: quizScore,
      loopDetected: quizScore >= 75,
    };

    let assessmentMode: 'quiz' | 'biometric' | 'hybrid' = 'quiz';

    // If biometric camera data is provided, combine with 65/35 weight
    if (biometricMetrics) {
      assessmentMode = 'hybrid';
      metrics = biometricMetrics;
      const bioScore =
        metrics.pathRepetition * this.weights.pathRepetition +
        metrics.idleBehavior * this.weights.idleBehavior +
        metrics.movementRepetition * this.weights.movementRepetition +
        metrics.predictability * this.weights.predictability +
        (100 - metrics.movementRandomness) * this.weights.lowRandomness;

      finalScore = Math.round(quizScore * 0.65 + bioScore * 0.35);
    }

    const npcLevel = this.determineNPCLevel(finalScore);
    const { percentage: mainCharacterPotential, reason: mainCharacterReason } =
      this.calculateMainCharacterPotential(finalScore, dominantType);

    // Build funny observations list
    const observations = [...quizObservations];
    if (observations.length < 3) {
      const generalPool = FUNNY_OBSERVATIONS_POOL.general;
      observations.push(generalPool[Math.floor(Math.random() * generalPool.length)]);
    }

    const subjectNum = Math.floor(1000 + Math.random() * 9000);
    const subjectCode = `SUB-${subjectNum}`;

    const behaviorSummary =
      finalScore >= 80
        ? `High compliance detected. Subject exhibited automated background behavior across multiple social scenarios.`
        : finalScore <= 30
        ? `Extreme behavioral variance detected. Subject repeatedly selected disruptive protagonist dialogue options.`
        : `Moderate baseline compliance. Subject functions reliably as an ambient background citizen.`;

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      subjectCode,
      npcScore: finalScore,
      npcLevel,
      npcType: dominantType,
      mainCharacterPotential,
      mainCharacterReason,
      metrics,
      behaviorSummary,
      observations: observations.slice(0, 4),
      scanDuration: 45,
      snapshotDataUrl,
      quizAnswers: answers,
      assessmentMode,
    };
  }

  /**
   * For pure camera scans
   */
  public compileScanResult(
    metrics: BehavioralMetrics,
    scanDurationSeconds: number,
    snapshotDataUrl?: string
  ): ScanResult {
    const lowRandomness = Math.max(0, 100 - metrics.movementRandomness);
    const rawScore =
      metrics.pathRepetition * this.weights.pathRepetition +
      metrics.idleBehavior * this.weights.idleBehavior +
      metrics.movementRepetition * this.weights.movementRepetition +
      metrics.predictability * this.weights.predictability +
      lowRandomness * this.weights.lowRandomness;

    const npcScore = Math.round(Math.min(100, Math.max(0, rawScore)));
    const npcLevel = this.determineNPCLevel(npcScore);

    let dominantType: NPCType = 'BACKGROUND CHARACTER';
    if (metrics.pathRepetition >= 75) dominantType = 'LOOPING NPC';
    else if (metrics.idleBehavior >= 75) dominantType = 'IDLE NPC';
    else if (npcScore <= 20) dominantType = 'MAIN CHARACTER';
    else if (npcScore >= 96) dominantType = 'FINAL BOSS NPC';

    const { percentage: mainCharacterPotential, reason: mainCharacterReason } =
      this.calculateMainCharacterPotential(npcScore, dominantType);

    const subjectNum = Math.floor(1000 + Math.random() * 9000);
    const subjectCode = `SUB-${subjectNum}`;

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      subjectCode,
      npcScore,
      npcLevel,
      npcType: dominantType,
      mainCharacterPotential,
      mainCharacterReason,
      metrics,
      behaviorSummary: `Subject analyzed via optical frame differencing over ${scanDurationSeconds.toFixed(1)}s window.`,
      observations: [
        metrics.idleBehavior > 60
          ? 'Subject remained stationary long enough to trigger background optimization mode.'
          : 'Path variance indicates active collision boundary exploration.',
        'Behavior pattern analyzed for absolutely no scientific reason.',
        'Subject would comfortably blend into Skyrim with zero texture mods.',
      ],
      scanDuration: scanDurationSeconds,
      snapshotDataUrl,
      assessmentMode: 'biometric',
    };
  }
}

export const scoringEngine = new ScoringEngine();

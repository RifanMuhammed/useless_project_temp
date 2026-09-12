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
    if (score <= 15) return 'MAIN CHARACTER';
    if (score <= 35) return 'UNPREDICTABLE HUMAN';
    if (score <= 55) return 'BACKGROUND EXTRA';
    if (score <= 75) return 'COMMON NPC';
    if (score <= 90) return 'HIGH LEVEL NPC';
    return 'FINAL BOSS NPC';
  }

  /**
   * Calculate Shannon Entropy H(X) = -sum(p(x) * log2(p(x))) across quiz answers
   */
  public calculateShannonEntropy(options: QuizOption[]): number {
    if (!options || options.length === 0) return 0;

    const counts: Record<number, number> = {};
    options.forEach((opt) => {
      // Group by score tier bins
      const bin = Math.floor(opt.scoreContribution / 10);
      counts[bin] = (counts[bin] || 0) + 1;
    });

    const total = options.length;
    let entropy = 0;
    Object.values(counts).forEach((count) => {
      const p = count / total;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    });

    // Max entropy for 4 bins is log2(4) = 2.0
    const maxEntropy = Math.log2(Math.min(4, total)) || 1;
    const normalizedEntropy = Math.min(100, Math.max(0, (entropy / maxEntropy) * 100));
    return Number(normalizedEntropy.toFixed(1));
  }

  /**
   * Calculate Cosine Similarity between two N-dimensional vectors
   */
  public calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Cosine Similarity Vector Archetype Clustering
   */
  public determineClusteredArchetype(
    score: number,
    shannonEntropy: number,
    kineticVariance: number,
    compliance: number
  ): NPCType {
    const userVector = [score, shannonEntropy, kineticVariance, compliance];

    // Reference Centroids for Archetype Tiers
    const centroids: Record<string, number[]> = {
      'MAIN CHARACTER': [10, 92, 90, 15],
      'BACKGROUND EXTRA': [50, 50, 50, 55],
      'BACKGROUND CHARACTER': [55, 45, 45, 60],
      'COMMON NPC': [70, 35, 30, 75],
      'HIGH LEVEL NPC': [88, 18, 15, 90],
      'FINAL BOSS NPC': [98, 5, 5, 98],
      'IDLE NPC': [85, 10, 5, 95],
      'LOOPING NPC': [90, 8, 10, 92],
      'WANDERING NPC': [45, 65, 60, 40],
      'QUEST NPC': [65, 40, 25, 80],
      'MERCHANT NPC': [75, 25, 20, 85],
      'CONFUSED NPC': [35, 75, 80, 25],
      'GUARD NPC': [80, 20, 15, 90],
      'CUTSCENE NPC': [85, 15, 10, 95],
    };

    let bestType: NPCType = 'COMMON NPC';
    let maxSim = -1;

    for (const [type, centroid] of Object.entries(centroids)) {
      const sim = this.calculateCosineSimilarity(userVector, centroid);
      if (sim > maxSim) {
        maxSim = sim;
        bestType = type as NPCType;
      }
    }

    return bestType;
  }

  /**
   * Calculate score from Quiz Answers
   */
  public calculateQuizScore(answers: Record<number, QuizOption>): {
    score: number;
    dominantType: NPCType;
    observations: string[];
    shannonEntropy: number;
  } {
    const options = Object.values(answers);
    if (options.length === 0) {
      return { score: 50, dominantType: 'COMMON NPC', observations: [], shannonEntropy: 50 };
    }

    const maxPerQuestion = 35;
    const totalMax = options.length * maxPerQuestion;
    const totalRaw = options.reduce((sum, opt) => sum + opt.scoreContribution, 0);

    const normalizedScore = Math.round(Math.min(100, Math.max(0, (totalRaw / totalMax) * 100)));
    const shannonEntropy = this.calculateShannonEntropy(options);

    // Vector Clustering Archetype Assignment
    const dominantType = this.determineClusteredArchetype(
      normalizedScore,
      shannonEntropy,
      100 - normalizedScore,
      normalizedScore
    );

    // Collect observation flavors
    const observations = options
      .map((opt) => opt.observationFlavor)
      .filter(Boolean);

    return {
      score: normalizedScore,
      dominantType,
      observations,
      shannonEntropy,
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

    let reason = 'You show steady daily habits, keeping things simple and organized.';
    if (clampedPotential >= 80) {
      reason = 'High creative & spontaneous energy! You have true main character energy.';
    } else if (clampedPotential >= 55) {
      reason = 'Occasional creative bursts! You show strong free will whenever you want to.';
    } else if (clampedPotential >= 35) {
      reason = 'You show clear moments of free will, but mostly enjoy a peaceful, steady routine.';
    } else if (score >= 90) {
      reason = 'You love comfort and routine, leaving main-character drama to everyone else!';
    }

    return {
      percentage: clampedPotential,
      reason,
    };
  }

  /**
   * Compile Multi-Vector Sub-Scores with Floating Point Precision
   */
  public calculateSubScores(
    npcScore: number,
    metrics: BehavioralMetrics,
    options: QuizOption[]
  ): {
    kineticVariance: number;
    conversationalEntropy: number;
    environmentalCompliance: number;
    rogueProtagonistIndex: number;
  } {
    const optionsCount = options.length || 1;
    const optionContributions = options.map((o) => o.scoreContribution);
    
    // Calculate variance among answers
    const avgContrib = optionContributions.reduce((a, b) => a + b, 0) / optionsCount;
    const varianceSum = optionContributions.reduce((sum, c) => sum + Math.pow(c - avgContrib, 2), 0);
    const entropyRaw = Math.min(100, Math.sqrt(varianceSum / optionsCount) * 4.5);

    const kineticVariance = Number(
      Math.min(99.9, Math.max(0.1, (metrics.movementRandomness * 0.6) + ((100 - metrics.pathRepetition) * 0.4))).toFixed(1)
    );
    const conversationalEntropy = Number(
      Math.min(99.9, Math.max(0.1, entropyRaw + (100 - npcScore) * 0.3)).toFixed(1)
    );
    const environmentalCompliance = Number(
      Math.min(99.9, Math.max(0.1, (npcScore * 0.7) + (metrics.predictability * 0.3))).toFixed(1)
    );
    const rogueProtagonistIndex = Number(
      Math.min(99.9, Math.max(0.1, 100 - npcScore + (entropyRaw * 0.2))).toFixed(1)
    );

    return {
      kineticVariance,
      conversationalEntropy,
      environmentalCompliance,
      rogueProtagonistIndex,
    };
  }

  /**
   * Compile Complete Multi-Factor Scan Result with High Precision Metrics
   */
  public compileQuizResult(
    answers: Record<number, QuizOption>,
    biometricMetrics?: BehavioralMetrics,
    snapshotDataUrl?: string,
    averageLatencyMs?: number
  ): ScanResult {
    const { score: quizScore, dominantType, observations: quizObservations } = this.calculateQuizScore(answers);
    const options = Object.values(answers);

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

    if (biometricMetrics) {
      assessmentMode = 'hybrid';
      metrics = { ...metrics, ...biometricMetrics };
      const bioScore =
        metrics.pathRepetition * this.weights.pathRepetition +
        metrics.idleBehavior * this.weights.idleBehavior +
        metrics.movementRepetition * this.weights.movementRepetition +
        metrics.predictability * this.weights.predictability +
        (100 - metrics.movementRandomness) * this.weights.lowRandomness;

      finalScore = Math.round(quizScore * 0.65 + bioScore * 0.35);
    }

    const reactionLatencyMs = Number((averageLatencyMs || (420 + Math.random() * 380)).toFixed(1));
    const decisionParalysisIndex = Math.min(100, Math.round((reactionLatencyMs / 1200) * 100));
    
    // Diagnostic confidence calibration (94.0% - 99.6%)
    const diagnosticConfidence = Number(
      Math.min(99.6, Math.max(94.0, 94.5 + (options.length * 0.7) + (biometricMetrics ? 2.1 : 0))).toFixed(1)
    );

    const subScores = this.calculateSubScores(finalScore, metrics, options);
    const npcLevel = this.determineNPCLevel(finalScore);
    const { percentage: mainCharacterPotential, reason: mainCharacterReason } =
      this.calculateMainCharacterPotential(finalScore, dominantType);

    // Build 5 clear, human-understandable, contextual observations
    const observations: string[] = [];

    // Obs 1: Biometric/Posture observation
    if (biometricMetrics) {
      const headStab = metrics.headPositionStability ?? Math.round(100 - metrics.movementRandomness);
      observations.push(
        `📷 Camera Posture: You held your body ${headStab > 70 ? 'completely still like a video game NPC' : 'with active, natural human movement'} (${headStab.toFixed(1)}% stillness rating).`
      );
    } else {
      observations.push(
        `🗺️ Routine Predictability: Based on your choices, your daily habits are estimated to be ${metrics.predictability.toFixed(1)}% predictable.`
      );
    }

    // Obs 2: Latency & Decision Speed
    observations.push(
      `⏱️ Decision Speed: You took an average of ${reactionLatencyMs}ms per question (${decisionParalysisIndex > 50 ? 'noticeable hesitation & overthinking' : 'fast, confident instincts'}).`
    );

    // Obs 3: Conversational Style
    observations.push(
      `💬 Social Dialogue Style: ${subScores.conversationalEntropy > 50 ? 'Unpredictable & wild — you love breaking small-talk rules' : 'Polite & standard — you rely on safe canned responses'}. (${subScores.conversationalEntropy}% Dialogue Variety).`
    );

    // Obs 4: Specific Quiz Answer Observation
    if (quizObservations.length > 0) {
      observations.push(`🎯 Behavior Trait: ${quizObservations[0]}`);
    } else {
      observations.push('🎯 Behavior Trait: You follow environmental social rules without making a scene.');
    }

    // Obs 5: Extra observation or Protagonist Index
    if (quizObservations.length > 1) {
      observations.push(`⚡ Character Quirk: ${quizObservations[1]}`);
    } else {
      const generalPool = FUNNY_OBSERVATIONS_POOL.general;
      const fallbackObs = generalPool[Math.floor(Math.random() * generalPool.length)];
      observations.push(`⚡ Overall Rating: ${fallbackObs || `Main Character Potential is ${subScores.rogueProtagonistIndex}% with ${diagnosticConfidence}% diagnostic confidence.`}`);
    }

    const subjectNum = Math.floor(1000 + Math.random() * 9000);
    const subjectCode = `SUB-${subjectNum}`;

    const behaviorSummary =
      finalScore >= 80
        ? `HIGH NPC SCORE (${finalScore}%): You are a model background character! You love predictable daily routines, safe small-talk, and zero drama.`
        : finalScore <= 30
        ? `MAIN CHARACTER ENERGY (${finalScore}% NPC): You are a rogue protagonist! You reject boring rules, make chaotic choices, and break scripted expectations.`
        : `BALANCED HUMAN (${finalScore}% NPC): You have a healthy mix of everyday routine and unpredictable free will. You blend in when needed, but stay true to yourself!`;

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      subjectCode,
      npcScore: finalScore,
      npcLevel,
      npcType: dominantType,
      mainCharacterPotential,
      mainCharacterReason,
      metrics: {
        ...metrics,
        kineticVarianceScore: subScores.kineticVariance,
        conversationalEntropyScore: subScores.conversationalEntropy,
        environmentalComplianceRating: subScores.environmentalCompliance,
        rogueProtagonistPotentialIndex: subScores.rogueProtagonistIndex,
        reactionLatencyMs,
        decisionParalysisIndex,
        diagnosticConfidence,
      },
      subScores,
      reactionLatencyMs,
      decisionParalysisIndex,
      diagnosticConfidence,
      behaviorSummary,
      observations: observations.slice(0, 5),
      scanDuration: 45,
      snapshotDataUrl,
      quizAnswers: answers,
      assessmentMode,
    };
  }

  /**
   * For pure camera scans with high precision calibration
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

    const subScores = this.calculateSubScores(npcScore, metrics, []);
    const reactionLatencyMs = Number((340 + Math.random() * 210).toFixed(1));
    const decisionParalysisIndex = Math.min(100, Math.round((reactionLatencyMs / 1200) * 100));
    const diagnosticConfidence = Number((96.2 + Math.random() * 2.8).toFixed(1));

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
      metrics: {
        ...metrics,
        kineticVarianceScore: subScores.kineticVariance,
        conversationalEntropyScore: subScores.conversationalEntropy,
        environmentalComplianceRating: subScores.environmentalCompliance,
        rogueProtagonistPotentialIndex: subScores.rogueProtagonistIndex,
        reactionLatencyMs,
        decisionParalysisIndex,
        diagnosticConfidence,
      },
      subScores,
      reactionLatencyMs,
      decisionParalysisIndex,
      diagnosticConfidence,
      behaviorSummary: `Subject analyzed via high-precision optical frame differencing over ${scanDurationSeconds.toFixed(1)}s window.`,
      observations: [
        `Micro-head movement stability: ${(100 - metrics.movementRandomness).toFixed(1)}% delta over optical frame buffer.`,
        `Idle posture lock duration: ${(metrics.idleBehavior * 0.05).toFixed(1)} seconds continuously stationary.`,
        `Sub-score Environmental Compliance: ${subScores.environmentalCompliance}% rating.`,
        `Decision Latency calibration: ${reactionLatencyMs}ms per frame diff window.`,
        `Diagnostic confidence level certified at ${diagnosticConfidence}% signal stability.`,
      ],
      scanDuration: scanDurationSeconds,
      snapshotDataUrl,
      assessmentMode: 'biometric',
    };
  }
}

export const scoringEngine = new ScoringEngine();

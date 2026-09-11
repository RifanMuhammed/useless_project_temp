import type { Achievement, LeaderboardEntry, ScanResult } from '../types/npc';
import { INITIAL_ACHIEVEMENTS } from '../constants/achievements';

const LEADERBOARD_KEY = 'npc_ano_leaderboard_v1';
const ACHIEVEMENTS_KEY = 'npc_ano_achievements_v1';
const SCAN_HISTORY_KEY = 'npc_ano_scans_v1';

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    rank: 1,
    name: 'THE GUY WHO WALKED IN CIRCLES',
    npcScore: 99,
    npcLevel: 'FINAL BOSS NPC',
    npcType: 'LOOPING NPC',
    timestamp: Date.now() - 86400000 * 3,
    avatarSeed: 'circles',
  },
  {
    id: 'seed-2',
    rank: 2,
    name: 'DOOR GUARD',
    npcScore: 97,
    npcLevel: 'FINAL BOSS NPC',
    npcType: 'GUARD NPC',
    timestamp: Date.now() - 86400000 * 2,
    avatarSeed: 'guard',
  },
  {
    id: 'seed-3',
    rank: 3,
    name: 'SUSPICIOUSLY STILL PERSON',
    npcScore: 96,
    npcLevel: 'FINAL BOSS NPC',
    npcType: 'IDLE NPC',
    timestamp: Date.now() - 86400000 * 1.5,
    avatarSeed: 'still',
  },
  {
    id: 'seed-4',
    rank: 4,
    name: 'QUEST GIVER BEHIND COUNTER',
    npcScore: 94,
    npcLevel: 'HIGH LEVEL NPC',
    npcType: 'QUEST NPC',
    timestamp: Date.now() - 86400000,
    avatarSeed: 'quest',
  },
  {
    id: 'seed-5',
    rank: 5,
    name: 'RANDOM STREET EXTRA',
    npcScore: 91,
    npcLevel: 'HIGH LEVEL NPC',
    npcType: 'BACKGROUND CHARACTER',
    timestamp: Date.now() - 3600000 * 12,
    avatarSeed: 'random',
  },
  {
    id: 'seed-6',
    rank: 6,
    name: 'CORRIDOR ROAMER',
    npcScore: 88,
    npcLevel: 'HIGH LEVEL NPC',
    npcType: 'WANDERING NPC',
    timestamp: Date.now() - 3600000 * 6,
    avatarSeed: 'roamer',
  },
  {
    id: 'seed-7',
    rank: 7,
    name: 'THE SPEEDRUNNER ANOMALY',
    npcScore: 12,
    npcLevel: 'MAIN CHARACTER',
    npcType: 'BACKGROUND CHARACTER',
    timestamp: Date.now() - 3600000 * 2,
    avatarSeed: 'speedrunner',
  },
];

class StorageService {
  // Leaderboard
  public getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === 'undefined') return SEED_LEADERBOARD;
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (!data) {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(SEED_LEADERBOARD));
        return SEED_LEADERBOARD;
      }
      return JSON.parse(data);
    } catch {
      return SEED_LEADERBOARD;
    }
  }

  public addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp' | 'rank'>): LeaderboardEntry[] {
    const list = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      isCustom: true,
    };

    const combined = [newEntry, ...list];
    // Sort descending by score
    combined.sort((a, b) => b.npcScore - a.npcScore);

    // Assign rank numbers
    const ranked = combined.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(ranked));
    } catch (e) {
      console.warn('Failed to save leaderboard to localStorage', e);
    }

    return ranked;
  }

  // Achievements
  public getAchievements(): Achievement[] {
    if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (!data) {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
        return INITIAL_ACHIEVEMENTS;
      }
      const saved: Achievement[] = JSON.parse(data);
      // Merge in any newly added achievements from constants
      return INITIAL_ACHIEVEMENTS.map(initial => {
        const found = saved.find(s => s.id === initial.id);
        return found ? found : initial;
      });
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public unlockAchievement(achievementId: string): { achievement: Achievement | null; newlyUnlocked: boolean } {
    const achievements = this.getAchievements();
    const target = achievements.find(a => a.id === achievementId);

    if (!target) return { achievement: null, newlyUnlocked: false };
    if (target.unlocked) return { achievement: target, newlyUnlocked: false };

    target.unlocked = true;
    target.unlockedAt = Date.now();

    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Failed to save achievements', e);
    }

    return { achievement: target, newlyUnlocked: true };
  }

  // Scan History
  public saveScanResult(result: ScanResult): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(SCAN_HISTORY_KEY);
      const list: ScanResult[] = data ? JSON.parse(data) : [];
      // Keep last 20 scans
      const cleanResult = { ...result };
      const updated = [cleanResult, ...list].slice(0, 20);
      localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save scan history', e);
    }
  }

  public getScanHistory(): ScanResult[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SCAN_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const storageService = new StorageService();

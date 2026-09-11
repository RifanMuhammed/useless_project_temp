import type { NPCLevel, NPCType } from '../types/npc';

export interface LevelDefinition {
  level: NPCLevel;
  minScore: number;
  maxScore: number;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  summary: string;
  flavorQuote: string;
}

export const NPC_LEVELS: LevelDefinition[] = [
  {
    level: 'MAIN CHARACTER',
    minScore: 0,
    maxScore: 20,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    borderColor: 'border-emerald-500',
    glowColor: 'shadow-emerald-500/50',
    summary: 'Erratic, non-linear movement trajectory detected. Demonstrates zero respect for game scripting.',
    flavorQuote: '“Warning: Subject exhibits excessive protagonist energy. Quests may be derailed.”',
  },
  {
    level: 'UNPREDICTABLE HUMAN',
    minScore: 21,
    maxScore: 40,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500',
    glowColor: 'shadow-cyan-500/50',
    summary: 'Subject exhibits noticeable organic unpredictability. Partially immune to basic pathfinding AI.',
    flavorQuote: '“Subject demonstrates occasional free will, though behavior remains suspicious.”',
  },
  {
    level: 'BACKGROUND EXTRA',
    minScore: 41,
    maxScore: 60,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500',
    glowColor: 'shadow-amber-500/50',
    summary: 'Blends into surroundings with minimal cognitive overhead. Fits standard urban backdrop parameters.',
    flavorQuote: '“Ideal for populating low-density open world zones without dropping frame rates.”',
  },
  {
    level: 'COMMON NPC',
    minScore: 61,
    maxScore: 80,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderColor: 'border-indigo-500',
    glowColor: 'shadow-indigo-500/50',
    summary: 'Reliable, predictable motion cycles. Likely to have 2 lines of unskippable ambient dialogue.',
    flavorQuote: '“Subject follows predetermined navmesh with commendable obedience.”',
  },
  {
    level: 'HIGH LEVEL NPC',
    minScore: 81,
    maxScore: 95,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/50',
    summary: 'Exceptional repetition and prolonged idle behavior. Highly optimized for background loops.',
    flavorQuote: '“Subject appears to be permanently waiting for the player to press [E] to interact.”',
  },
  {
    level: 'FINAL BOSS NPC',
    minScore: 96,
    maxScore: 100,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderColor: 'border-rose-500',
    glowColor: 'shadow-rose-500/50',
    summary: 'Theoretical maximum NPC compliance. Perfectly scripted existence with absolute zero entropy.',
    flavorQuote: '“System admiration level: 100%. The ultimate manifestation of automated existence.”',
  },
];

export interface TypeDefinition {
  type: NPCType;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
}

export const NPC_TYPES: Record<NPCType, TypeDefinition> = {
  'IDLE NPC': {
    type: 'IDLE NPC',
    title: 'Idle NPC',
    tagline: 'Waiting for player input since inception',
    description: 'High stillness index with subtle cyclical breathing drift. May look around periodically to maintain illusion of consciousness.',
    iconName: 'PauseCircle',
  },
  'LOOPING NPC': {
    type: 'LOOPING NPC',
    title: 'Looping NPC',
    tagline: 'Perpetual back-and-forth patrol cycle',
    description: 'Walks the exact same 3-meter line endlessly. Will bump into obstacles and turn 180 degrees without breaking character.',
    iconName: 'RotateCw',
  },
  'WANDERING NPC': {
    type: 'WANDERING NPC',
    title: 'Wandering NPC',
    tagline: 'Aimless exploration without objective',
    description: 'Walks around with no discernible destination or purpose. Frequently pauses to stare into blank space or walls.',
    iconName: 'Compass',
  },
  'QUEST NPC': {
    type: 'QUEST NPC',
    title: 'Quest Giver NPC',
    tagline: 'Stationary beacon of unskippable dialogue',
    description: 'Maintains designated coordinates. Gestures subtly when approached in hopes of handing over a fetch quest.',
    iconName: 'HelpCircle',
  },
  'MERCHANT NPC': {
    type: 'MERCHANT NPC',
    title: 'Merchant NPC',
    tagline: 'Has wares if you have coin',
    description: 'Guards an invisible shop stall. Does not move feet; only rotates upper torso toward points of interest.',
    iconName: 'ShoppingBag',
  },
  'CONFUSED NPC': {
    type: 'CONFUSED NPC',
    title: 'Confused NPC',
    tagline: 'Navmesh recalculation failed',
    description: 'Jerky micro-turns and erratic stops. Frequently attempts to pathfind through invisible boundaries.',
    iconName: 'HelpCircle',
  },
  'GUARD NPC': {
    type: 'GUARD NPC',
    title: 'Guard NPC',
    tagline: 'Must have been the wind',
    description: 'Strict sentinel posture. Ignores obvious anomalies until directly collided with by the protagonist.',
    iconName: 'Shield',
  },
  'CUTSCENE NPC': {
    type: 'CUTSCENE NPC',
    title: 'Cutscene NPC',
    tagline: 'Locked into scripted cinematic motion',
    description: 'Performs dramatic gestures regardless of whether anyone is watching. Ignores all player chaos.',
    iconName: 'Film',
  },
  'BACKGROUND CHARACTER': {
    type: 'BACKGROUND CHARACTER',
    title: 'Background Character',
    tagline: 'Ambient world filler',
    description: 'Consumes exactly 0.02ms of CPU frame budget. Exists solely to make the world look populated.',
    iconName: 'Users',
  },
  'FINAL BOSS NPC': {
    type: 'FINAL BOSS NPC',
    title: 'Final Boss NPC',
    tagline: 'Phased attack patterns only',
    description: 'Unflinching dominance over coordinate space. Zero spontaneous behavior detected.',
    iconName: 'Crown',
  },
};

export const FUNNY_OBSERVATIONS_POOL = {
  highIdle: [
    'Subject has been idle long enough to trigger an energy-saving screensaver.',
    'Stillness index suggests subject is waiting for the player to press [E] to talk.',
    'Subject has entered low-poly background optimization mode.',
    'Breathing detected, but overall motivation appears suspended.',
    'Subject maintained a statue-like posture for an alarming percentage of the observation.',
  ],
  highRepetition: [
    'Subject has walked past the same invisible waypoint 7 times.',
    'Spatial recurrence matches standard game patrol route v1.04.',
    'Movement pattern resembles a background character pacing in a corridor.',
    'Path predictability exceeds standard human variance by 340%.',
    'Subject appears to have entered an invisible scripted sequence.',
  ],
  lowRandomness: [
    'Randomness levels are dangerously low for an organic lifeform.',
    'Algorithm was able to forecast subject trajectory 8 seconds into the future.',
    'Sub-routine detected: standard loop cycle #042.',
    'Subject exhibits zero spontaneous improvisation.',
    'Entropy analysis indicates heavy reliance on preset animations.',
  ],
  highRandomness: [
    'Movement randomness exceeded baseline safety parameters.',
    'Subject demonstrates erratic protagonist behavior; quest markers ignored.',
    'Path entropy is too chaotic for background NPC simulation.',
    'Subject appears to be speedrunning daily existence.',
    'Camera tracking system struggled to anticipate sudden velocity spikes.',
  ],
  general: [
    'Behavioral analysis reveals no urgent life objectives at this time.',
    'Subject appears fully rendered, though purpose remains undefined.',
    'Potential quest-giver behavior detected near coordinate center.',
    'This behavior data will not be forwarded to any meaningful institution.',
    'We monitored this movement for 10 seconds and learned absolutely nothing.',
    'Subject would comfortably blend into Skyrim with zero texture mods.',
  ],
};

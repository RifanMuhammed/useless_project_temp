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
    summary: 'Wild, unpredictable behavior detected. You refuse to follow boring routines or scripted expectations.',
    flavorQuote: '“Warning: You possess powerful main-character energy! You live life entirely on your own terms.”',
  },
  {
    level: 'UNPREDICTABLE HUMAN',
    minScore: 21,
    maxScore: 40,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500',
    glowColor: 'shadow-cyan-500/50',
    summary: 'Highly creative and spontaneous. You mostly follow your own instincts rather than societal patterns.',
    flavorQuote: '“You show genuine originality and free will, keeping people guessing what you will do next.”',
  },
  {
    level: 'BACKGROUND EXTRA',
    minScore: 41,
    maxScore: 60,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500',
    glowColor: 'shadow-amber-500/50',
    summary: 'Natural, comfortable crowd member. You keep your head down, do your work, and enjoy a peaceful life.',
    flavorQuote: '“You blend right into the crowd effortlessly without causing any scene or unnecessary drama.”',
  },
  {
    level: 'COMMON NPC',
    minScore: 61,
    maxScore: 80,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderColor: 'border-indigo-500',
    glowColor: 'shadow-indigo-500/50',
    summary: 'Reliable and habit-driven. You prefer comfortable daily routines and polite everyday conversation.',
    flavorQuote: '“You stick to polite small talk and proven daily habits with impressive discipline.”',
  },
  {
    level: 'HIGH LEVEL NPC',
    minScore: 81,
    maxScore: 95,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/50',
    summary: 'Master of habits and extreme routine. You rarely deviate from your established daily schedule.',
    flavorQuote: '“Your daily schedule is so organized that your entire week could be planned in advance!”',
  },
  {
    level: 'FINAL BOSS NPC',
    minScore: 96,
    maxScore: 100,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderColor: 'border-rose-500',
    glowColor: 'shadow-rose-500/50',
    summary: 'Flawless routine execution. You follow rules and schedules with perfection and zero hesitation.',
    flavorQuote: '“100% Habit Discipline! You are the ultimate master of unshakeable daily routine.”',
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
  'COMMON NPC': {
    type: 'COMMON NPC',
    title: 'Common NPC',
    tagline: 'Standard 2-line dialogue vendor',
    description: 'Reliably populates town centers and responds with generic affirmative dialogue.',
    iconName: 'Users',
  },
  'BACKGROUND EXTRA': {
    type: 'BACKGROUND EXTRA',
    title: 'Background Extra',
    tagline: 'Ambient world filler',
    description: 'Consumes exactly 0.02ms of CPU frame budget. Exists solely to make the world look populated.',
    iconName: 'Users',
  },
  'BACKGROUND CHARACTER': {
    type: 'BACKGROUND CHARACTER',
    title: 'Background Character',
    tagline: 'Ambient world filler',
    description: 'Consumes minimal frame budget. Wanders standard urban background.',
    iconName: 'Users',
  },
  'HIGH LEVEL NPC': {
    type: 'HIGH LEVEL NPC',
    title: 'High Level NPC',
    tagline: 'Advanced scripted authority',
    description: 'Maintains strict compliance and controls critical background narrative checkpoints.',
    iconName: 'Award',
  },
  'FINAL BOSS NPC': {
    type: 'FINAL BOSS NPC',
    title: 'Final Boss NPC',
    tagline: 'Phased attack patterns only',
    description: 'Unflinching dominance over coordinate space. Zero spontaneous behavior detected.',
    iconName: 'Crown',
  },
  'MAIN CHARACTER': {
    type: 'MAIN CHARACTER',
    title: 'Rogue Main Character',
    tagline: 'Uncontrolled protagonist energy',
    description: 'Refuses all scripted paths and aggressively tests collision boundaries.',
    iconName: 'Sparkles',
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

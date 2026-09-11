import type { NPCType } from '../types/npc';

export interface QuizOption {
  id: string;
  text: string;
  subtext: string;
  scoreContribution: number; // 0 (Main Character) to 35 (Full NPC)
  npcType: NPCType;
  observationFlavor: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  scenario: string;
  prompt: string;
  icon: string;
  options: QuizOption[];
  isReflexChallenge?: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'SCENARIO 01 // SOCIAL SILENCE',
    scenario: 'You step into an elevator with a complete stranger. The ride is 30 seconds long.',
    prompt: 'How do you execute this encounter?',
    icon: 'Users',
    options: [
      {
        id: '1a',
        text: 'Stare motionlessly at the floor indicator numbers until the doors open.',
        subtext: 'Preserves CPU render budget by avoiding eye contact.',
        scoreContribution: 30,
        npcType: 'IDLE NPC',
        observationFlavor: 'Maintained statue-like gaze at elevator floor indicator for maximum social safety.',
      },
      {
        id: '1b',
        text: 'Deploy standard ambient dialogue: "Crazy weather today, huh?"',
        subtext: 'Cycle dialogue bank routine #04 to fill acoustic dead space.',
        scoreContribution: 35,
        npcType: 'COMMON NPC',
        observationFlavor: 'Reliably executes ambient weather dialogue line when within 2 meters of strangers.',
      },
      {
        id: '1c',
        text: 'Hand them a folded receipt and whisper: "Take this to the parking garage."',
        subtext: 'Attempt to initiate an unskippable side questline.',
        scoreContribution: 15,
        npcType: 'QUEST NPC',
        observationFlavor: 'Suspected of distributing unauthorized fetch quests in public transit.',
      },
      {
        id: '1d',
        text: 'Crouch repeatedly in the corner to test elevator collision physics.',
        subtext: 'Standard speedrunner boundary testing sequence.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject attempted to boundary-clip through the elevator wall.',
      },
    ],
  },
  {
    id: 2,
    category: 'SCENARIO 02 // PATHFINDING & COMMUTE',
    scenario: 'You are walking to work, school, or the store.',
    prompt: 'What describes your movement navmesh?',
    icon: 'Compass',
    options: [
      {
        id: '2a',
        text: 'I walk the exact same sidewalk path down to the precise millisecond every day.',
        subtext: 'Hardcoded navmesh waypoint compliance: 100%.',
        scoreContribution: 35,
        npcType: 'LOOPING NPC',
        observationFlavor: 'Pathfinding data shows zero deviation from designated patrol route since 2021.',
      },
      {
        id: '2b',
        text: 'I attempt small route variations, but a blocked sidewalk completely halts my internal GPS.',
        subtext: 'Recalculating path... please wait.',
        scoreContribution: 25,
        npcType: 'CONFUSED NPC',
        observationFlavor: 'Pedestrian rerouting algorithm fails whenever construction cones appear.',
      },
      {
        id: '2c',
        text: 'I stare straight ahead and pace at a uniform 1.2 m/s without stopping.',
        subtext: 'Standard urban background extra walking loop.',
        scoreContribution: 28,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Paces at constant velocity without checking surroundings.',
      },
      {
        id: '2d',
        text: 'I take shortcuts through bushes, jump over benches, and sprint randomly.',
        subtext: 'Protagonist stamina bar management in full effect.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject consistently ignores designated sidewalks in favor of parkour.',
      },
    ],
  },
  {
    id: 3,
    category: 'SCENARIO 03 // DAILY SCRIPT LOOP',
    scenario: 'Your typical morning and weekday routine arrives.',
    prompt: 'How predictable is your execution loop?',
    icon: 'RotateCw',
    options: [
      {
        id: '3a',
        text: 'Alarm at 7:00 AM, identical coffee mug, exact same lunch at 12:00 PM on the dot.',
        subtext: 'Loop cycle predictability exceeds 98.4%.',
        scoreContribution: 35,
        npcType: 'HIGH LEVEL NPC',
        observationFlavor: 'Daily loop is so optimized that game engine pre-caches routine 48 hours in advance.',
      },
      {
        id: '3b',
        text: 'I wait for someone else to tell me what task needs completing next.',
        subtext: 'Event listener awaiting external trigger.',
        scoreContribution: 30,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Cannot initiate action without explicit external prompt.',
      },
      {
        id: '3c',
        text: 'I guard my desk/counter and only rotate upper torso when spoken to.',
        subtext: 'Classic shopkeeper stationary stance.',
        scoreContribution: 30,
        npcType: 'MERCHANT NPC',
        observationFlavor: 'Guards workspace station with unwavering sentinel discipline.',
      },
      {
        id: '3d',
        text: 'Wake up at 3:00 AM, eat dry cereal in the dark, start a completely random side hobby.',
        subtext: 'Zero routine entropy. Total chaos.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Circadian rhythm matches that of a rogue gamer with infinite sidequests.',
      },
    ],
  },
  {
    id: 4,
    category: 'SCENARIO 04 // DIALOGUE TREE RESPONSE',
    scenario: 'Someone small-talks you about their weekend.',
    prompt: 'Select your default verbal response subroutine:',
    icon: 'MessageSquare',
    options: [
      {
        id: '4a',
        text: 'Cycle between: "Nice!", "Sounds good!", and "Haha yeah!" on a 4-second delay.',
        subtext: 'Minimal dialogue bank capacity: 3 lines.',
        scoreContribution: 35,
        npcType: 'COMMON NPC',
        observationFlavor: 'Verbal response generator limited to 3 canned affirmative statements.',
      },
      {
        id: '4b',
        text: 'Repeat the exact previous sentence if they didn\'t hear me the first time.',
        subtext: 'Voice line repeat index: 1.0.',
        scoreContribution: 30,
        npcType: 'IDLE NPC',
        observationFlavor: 'Replays identical audio track when dialogue is triggered twice.',
      },
      {
        id: '4c',
        text: 'Launch into an unskippable 4-minute lore monologue about my specific hyper-fixation.',
        subtext: 'Player is unable to press [ESC] to skip.',
        scoreContribution: 20,
        npcType: 'CUTSCENE NPC',
        observationFlavor: 'Locks conversational partners into unskippable cinematic dialogue sequences.',
      },
      {
        id: '4d',
        text: 'Respond with a completely unhinged riddle that makes no chronological sense.',
        subtext: 'Dialogue tree DERAILED.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Conversational choices disrupt all standard social navmeshes.',
      },
    ],
  },
  {
    id: 5,
    category: 'SCENARIO 05 // ANOMALY & CHAOS REACTION',
    scenario: 'A loud bang or suspicious noise happens nearby.',
    prompt: 'What is your immediate tactical reaction?',
    icon: 'AlertTriangle',
    options: [
      {
        id: '5a',
        text: 'Look around for 2.5 seconds, then mutter: "Must have been the wind."',
        subtext: 'Aggro level resets to 0 immediately.',
        scoreContribution: 35,
        npcType: 'GUARD NPC',
        observationFlavor: 'Suspicion meter dropped from 100% to 0% in under 3 seconds.',
      },
      {
        id: '5b',
        text: 'Ignore it completely because the event occurred outside my render distance.',
        subtext: 'Zero cognitive processing spent on ambient physics.',
        scoreContribution: 32,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Maintains low-poly ambient posture even during high-decibel disturbances.',
      },
      {
        id: '5c',
        text: 'Panic and run in a frantic 5-meter circle with my hands raised in the air.',
        subtext: 'Classic GTA pedestrian panic protocol.',
        scoreContribution: 22,
        npcType: 'CONFUSED NPC',
        observationFlavor: 'Pedestrian panic subroutine executed with 100% theatrical accuracy.',
      },
      {
        id: '5d',
        text: 'Draw an imaginary weapon, crouch behind a potted plant, and prepare for boss fight.',
        subtext: 'Main character combat mode activated.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject instantly entered stealth combat stance for zero reason.',
      },
    ],
  },
  {
    id: 6,
    category: 'SCENARIO 06 // FREE WILL CHALLENGE',
    scenario: 'A mandatory corporate or social system command appears on your screen.',
    prompt: 'THE SYSTEM INSTRUCTS YOU: "DO NOT CLICK THE RED OBEDIENCE BUTTON".',
    icon: 'Zap',
    isReflexChallenge: true,
    options: [
      {
        id: '6a',
        text: 'Obey instantly without questioning authority.',
        subtext: 'System Compliance Index: 100%.',
        scoreContribution: 35,
        npcType: 'FINAL BOSS NPC',
        observationFlavor: 'Exhibits absolute, unquestioning compliance with all system prompts.',
      },
      {
        id: '6b',
        text: 'Hesitate for 10 seconds wondering if this is a trick, then comply anyway.',
        subtext: 'Temporary illusion of free will detected.',
        scoreContribution: 25,
        npcType: 'COMMON NPC',
        observationFlavor: 'Briefly considered disobedience before automated compliance took over.',
      },
      {
        id: '6c',
        text: 'Smash the forbidden button 15 times to see what breaks.',
        subtext: 'Defiance detected. Protagonist anomaly.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject actively spams forbidden controls to trigger system errors.',
      },
    ],
  },
];

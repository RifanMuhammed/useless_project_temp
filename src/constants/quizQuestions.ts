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

export const QUIZ_QUESTIONS_POOL: QuizQuestion[] = [
  {
    id: 1,
    category: 'SOCIAL SILENCE',
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
    category: 'PATHFINDING & COMMUTE',
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
    category: 'DAILY SCRIPT LOOP',
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
    category: 'DIALOGUE TREE RESPONSE',
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
    category: 'ANOMALY & CHAOS REACTION',
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
    category: 'GROCERY NAVMESH',
    scenario: 'You are in a supermarket and someone with a shopping cart is blocking the exact cereal box you need.',
    prompt: 'How do you resolve this obstruction?',
    icon: 'ShoppingCart',
    options: [
      {
        id: '6a',
        text: 'Pretend to inspect a jar of pickles 3 feet away until they finish loading their cart.',
        subtext: 'Passive proximity idle animation engaged.',
        scoreContribution: 32,
        npcType: 'IDLE NPC',
        observationFlavor: 'Exhibited classic pickle-gazing idle delay while waiting for spatial clear.',
      },
      {
        id: '6b',
        text: 'Walk away entirely, loop around aisle 4 three times, and check if the obstruction cleared.',
        subtext: 'Full navmesh reroute loop executed.',
        scoreContribution: 35,
        npcType: 'LOOPING NPC',
        observationFlavor: 'Completed 3 full perimeter loops instead of asking person to move.',
      },
      {
        id: '6c',
        text: 'Say "Excuse me" in a pitch so quiet it is only audible to bats, then surrender.',
        subtext: 'Audio output gain set to 2%.',
        scoreContribution: 28,
        npcType: 'COMMON NPC',
        observationFlavor: 'Failed dialogue check due to insufficient vocal amplitude.',
      },
      {
        id: '6d',
        text: 'Reach directly over their shoulder without looking, grab the box, and power-walk away.',
        subtext: 'Speedrun item grab optimization.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject executed zero-courtesy instant item pick-up animation.',
      },
    ],
  },
  {
    id: 7,
    category: 'COFFEE SUBROUTINE',
    scenario: 'You are ordering morning beverage at a cafe counter.',
    prompt: 'What order transaction protocol do you broadcast?',
    icon: 'Coffee',
    options: [
      {
        id: '7a',
        text: 'Exact same medium black coffee / vanilla latte, verbatim, every single day since 2019.',
        subtext: 'Pre-cached order transaction ID.',
        scoreContribution: 35,
        npcType: 'HIGH LEVEL NPC',
        observationFlavor: 'Barista began brewing beverage 40 seconds before subject entered the building.',
      },
      {
        id: '7b',
        text: 'Panic at the menu board, order whatever the person in front of you ordered.',
        subtext: 'Memory buffer copy-paste protocol.',
        scoreContribution: 30,
        npcType: 'CONFUSED NPC',
        observationFlavor: 'Mirroring customer order choices to avoid menu decision tree.',
      },
      {
        id: '7c',
        text: 'Nod silently, point at the pastry case, hand over exact change, and retreat to corner.',
        subtext: 'Non-verbal merchant exchange.',
        scoreContribution: 25,
        npcType: 'MERCHANT NPC',
        observationFlavor: 'Minimizes verbal handshake to complete transaction in under 6 seconds.',
      },
      {
        id: '7d',
        text: 'Ask the barista: "What is your hardest quest?" while placing 3 ancient coins on counter.',
        subtext: 'Initiating custom dialogue quest tree.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject attempted to tip barista in fictional currency.',
      },
    ],
  },
  {
    id: 8,
    category: 'GROUP CHAT SYNC',
    scenario: 'A notification pops up in your main group chat: "anyone free tonight?"',
    prompt: 'Select your event handling subroutine:',
    icon: 'Smartphone',
    options: [
      {
        id: '8a',
        text: 'Read it immediately, type a draft, delete it, and reply 4 hours later with "just saw this!"',
        subtext: 'Simulated latency buffer delay.',
        scoreContribution: 32,
        npcType: 'COMMON NPC',
        observationFlavor: 'Deliberately delayed message response to simulate busy schedule.',
      },
      {
        id: '8b',
        text: 'Send a single thumbs-up reaction emoji and return to background idle mode.',
        subtext: 'Minimal payload network transmission.',
        scoreContribution: 35,
        npcType: 'IDLE NPC',
        observationFlavor: 'Uses single emoji response to preserve social energy bandwidth.',
      },
      {
        id: '8c',
        text: 'Send a mysterious blurry photo of a fire hydrant with zero context.',
        subtext: 'Unpredictable random noise generator.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Sent unexplainable image asset to confuse group chat participants.',
      },
      {
        id: '8d',
        text: 'Ignore the notification entirely because your schedule is hardcoded until Sunday.',
        subtext: 'Event listener disabled for unscheduled events.',
        scoreContribution: 28,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Rejects spontaneous invites due to immutable schedule array.',
      },
    ],
  },
  {
    id: 9,
    category: 'SYSTEM UPDATE PROMPT',
    scenario: 'Your OS presents a popup: "Mandatory system update required. Restart now?"',
    prompt: 'How many times do you execute the "Remind Me Tomorrow" routine?',
    icon: 'ShieldAlert',
    options: [
      {
        id: '9a',
        text: 'Click "Restart Now" immediately like a model citizen.',
        subtext: '100% OS compliance rating.',
        scoreContribution: 35,
        npcType: 'HIGH LEVEL NPC',
        observationFlavor: 'Exhibits submissive enthusiasm for corporate software updates.',
      },
      {
        id: '9b',
        text: 'Postpone daily until the OS forcibly reboots your machine during a presentation.',
        subtext: 'Procrastination loop index maxed.',
        scoreContribution: 25,
        npcType: 'COMMON NPC',
        observationFlavor: 'Snoozed system update popup until automatic force-restart triggered.',
      },
      {
        id: '9c',
        text: 'Open terminal, disable update daemon, and continue running Linux kernel from 2017.',
        subtext: 'Rogue administrator privilege override.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject actively sabotaged OS update subroutines.',
      },
      {
        id: '9d',
        text: 'Stare at the countdown bar until it reaches 0 without touching mouse or keyboard.',
        subtext: 'Passive spectator stance.',
        scoreContribution: 30,
        npcType: 'IDLE NPC',
        observationFlavor: 'Watched update bar progress passively for 15 minutes straight.',
      },
    ],
  },
  {
    id: 10,
    category: 'PUBLIC TRANSIT SEATING',
    scenario: 'You board a train or bus with 50% empty seats.',
    prompt: 'Where does your spatial pathfinding algorithm guide you?',
    icon: 'Users',
    options: [
      {
        id: '10a',
        text: 'Pick the empty seat furthest from every other living human being.',
        subtext: 'Proximity isolation buffer maxed.',
        scoreContribution: 32,
        npcType: 'IDLE NPC',
        observationFlavor: 'Selected maximum distance coordinates relative to all onboard passengers.',
      },
      {
        id: '10b',
        text: 'Stand near the doors even though 20 seats are completely vacant.',
        subtext: 'Doorway blocking waypoint active.',
        scoreContribution: 35,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Occupied transit doorway despite abundance of available seating.',
      },
      {
        id: '10c',
        text: 'Sit directly next to a stranger and ask them: "What floor are you getting off at?"',
        subtext: 'Elevator dialogue tree leak in subway mode.',
        scoreContribution: 10,
        npcType: 'QUEST NPC',
        observationFlavor: 'Bypassed transit boundary norms to initiate confusing conversation.',
      },
      {
        id: '10d',
        text: 'Do push-ups in the aisle to increase your character stats during fast travel.',
        subtext: 'Stat grinding routine engaged.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject used public transit commute as an interactive gym zone.',
      },
    ],
  },
  {
    id: 11,
    category: 'WEATHER SMALL TALK',
    scenario: 'It starts raining heavily while you are standing under an awning.',
    prompt: 'What vocal audio line do you output to the person next to you?',
    icon: 'MessageSquare',
    options: [
      {
        id: '11a',
        text: '"We really needed this rain, to be honest."',
        subtext: 'Canned weather line #12 loaded.',
        scoreContribution: 35,
        npcType: 'COMMON NPC',
        observationFlavor: 'Uttered phrase "we really needed this" within 5 seconds of precipitation.',
      },
      {
        id: '11b',
        text: '"Looks like the sky is falling!" followed by a short dry chuckle.',
        subtext: 'Classic ambient comedy protocol.',
        scoreContribution: 32,
        npcType: 'IDLE NPC',
        observationFlavor: 'Executed light chuckling sequence regarding atmospheric conditions.',
      },
      {
        id: '11c',
        text: 'Sigh deeply, look up at sky, sigh again, and check phone weather app.',
        subtext: 'Triple gesture animation loop.',
        scoreContribution: 30,
        npcType: 'BACKGROUND EXTRA',
        observationFlavor: 'Checked weather forecast app while standing directly inside heavy rain.',
      },
      {
        id: '11d',
        text: 'Sprint out into the downpour yelling: "THE WATER GIVES ME STRENGTH!"',
        subtext: 'Elemental buff active.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject ran headfirst into storm with zero umbrella equipment.',
      },
    ],
  },
  {
    id: 12,
    category: 'FREE WILL REACTION TEST',
    scenario: 'A mandatory corporate or social system command appears on your screen.',
    prompt: 'THE SYSTEM INSTRUCTS YOU: "DO NOT CLICK THE RED OBEDIENCE BUTTON".',
    icon: 'Zap',
    isReflexChallenge: true,
    options: [
      {
        id: '12a',
        text: 'Obey instantly without questioning authority.',
        subtext: 'System Compliance Index: 100%.',
        scoreContribution: 35,
        npcType: 'FINAL BOSS NPC',
        observationFlavor: 'Exhibits absolute, unquestioning compliance with all system prompts.',
      },
      {
        id: '12b',
        text: 'Hesitate for 10 seconds wondering if this is a trick, then comply anyway.',
        subtext: 'Temporary illusion of free will detected.',
        scoreContribution: 25,
        npcType: 'COMMON NPC',
        observationFlavor: 'Briefly considered disobedience before automated compliance took over.',
      },
      {
        id: '12c',
        text: 'Smash the forbidden button 15 times to see what breaks.',
        subtext: 'Defiance detected. Protagonist anomaly.',
        scoreContribution: 0,
        npcType: 'MAIN CHARACTER',
        observationFlavor: 'Subject actively spams forbidden controls to trigger system errors.',
      },
    ],
  },
];

/**
 * Utility function to generate a randomized set of quiz questions.
 * Picks 5 regular scenarios + 1 reflex challenge scenario, and shuffles option orders.
 */
export function getRandomQuestions(count: number = 6): QuizQuestion[] {
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const reflexQuestions = QUIZ_QUESTIONS_POOL.filter((q) => q.isReflexChallenge);
  const regularQuestions = QUIZ_QUESTIONS_POOL.filter((q) => !q.isReflexChallenge);

  const shuffledRegular = shuffle(regularQuestions);
  const shuffledReflex = shuffle(reflexQuestions);

  const selected: QuizQuestion[] = [];

  // Pick count - 1 regular questions, and 1 reflex question for the end
  if (shuffledReflex.length > 0 && count > 1) {
    selected.push(...shuffledRegular.slice(0, count - 1));
    selected.push(shuffledReflex[0]);
  } else {
    selected.push(...shuffledRegular.slice(0, count));
  }

  // Format categories with SCENARIO step numbers and shuffle options
  return selected.map((q, idx) => ({
    ...q,
    category: `SCENARIO ${String(idx + 1).padStart(2, '0')} // ${q.category.replace(/^SCENARIO \d+ \/\/\s*/, '')}`,
    options: shuffle(q.options),
  }));
}

// Default static list for backwards compatibility
export const QUIZ_QUESTIONS = getRandomQuestions(6);


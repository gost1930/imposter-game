import { WORD_PAIRS, PUNISHMENTS } from "./gameContent";

export interface Player {
  id: number;
  name: string;
}

export interface GameState {
  players: Player[];
  word: string;
  wordCategory: string; // أضفت الفئة لجعل التخمين أصعب
  imposterIndices: number[];
  gamePhase:
    | "SETUP"
    | "REVEAL_ROLES"
    | "GAMEPLAY"
    | "VOTING"
    | "IMPOSTER_GUESS"
    | "PUNISHMENT"
    | "END_GAME"
    | "imposter_guess"
    | "resault";
  totalRounds: number;
  currentRound: number;
  currentPlayerIndex: number;
  questionsAsked: number;
  selectedPunishment: string | null;
  punishmentTargetIndex: number | null;
  votedOutPlayerIndex: number | null;
  imposterChosenIndex: number | null;
  gameResult:
    | "imposters_win"
    | "townspeople_win"
    | "imposter_wins"
    | null;
  guessOptions: string[]; // الكلمات الثلاث التي سيختار منها المحتال
}

export function initializeGame(playerNames: string[]): GameState {
  const players = playerNames.map((name, index) => ({
    id: index,
    name,
  }));

  const playerCount = players.length;
  const imposterCount = playerCount >= 6 ? 2 : 1;

  const imposterIndices: number[] = [];
  const availableIndices = Array.from({ length: playerCount }, (_, i) => i);
  for (let i = 0; i < imposterCount; i++) {
    const randomIdx = Math.floor(Math.random() * availableIndices.length);
    imposterIndices.push(availableIndices[randomIdx]);
    availableIndices.splice(randomIdx, 1);
  }

  const selectedPair =
    WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];

  return {
    players,
    word: selectedPair.word,
    wordCategory: selectedPair.category,
    imposterIndices,
    gamePhase: "REVEAL_ROLES",
    totalRounds: 2,
    currentRound: 0,
    currentPlayerIndex: 0, // سيتم تحديثه عند بدء اللعب
    questionsAsked: 0,
    selectedPunishment: null,
    punishmentTargetIndex: null,
    votedOutPlayerIndex: null,
    imposterChosenIndex: null,
    gameResult: null,
    guessOptions: [],
  };
}

// دالة لتوليد كلمات عشوائية من نفس الفئة للتمويه
function generateGuessOptions(correctWord: string, category: string): string[] {
  const sameCategoryWords = WORD_PAIRS.filter(
    (p) => p.category === category && p.word !== correctWord,
  ).map((p) => p.word);

  // خلط الكلمات واختيار 2 منها
  const shuffled = sameCategoryWords.sort(() => 0.5 - Math.random());
  const options = [correctWord, shuffled[0], shuffled[1]];

  // خلط الخيارات الثلاثة النهائية
  return options.sort(() => 0.5 - Math.random());
}

export function selectImpostor(
  state: GameState,
  votedPlayerIndex: number,
): GameState {
  const isCorrectChoice = state.imposterIndices.includes(votedPlayerIndex);

  // إذا تم كشف المحتال، ننتقل لمرحلة التخمين
  if (isCorrectChoice) {
    return {
      ...state,
      votedOutPlayerIndex: votedPlayerIndex,
      gamePhase: "IMPOSTER_GUESS",
      guessOptions: generateGuessOptions(state.word, state.wordCategory),
    };
  } else {
    // إذا أخطأ الصادقون، المحتال يفوز مباشرة ويختار ضحية
    return {
      ...state,
      votedOutPlayerIndex: votedPlayerIndex,
      gameResult: "imposters_win",
      gamePhase: "PUNISHMENT", // سينتقل لواجهة اختيار الضحية
    };
  }
}

export function handleImposterGuess(
  state: GameState,
  guessedWord: string,
): GameState {
  const isCorrect = guessedWord === state.word;
  const randomPunishment =
    PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];

  if (isCorrect) {
    // المحتال عرف الكلمة -> فاز ويختار من يعاقب
    return {
      ...state,
      gameResult: "imposters_win",
      gamePhase: "PUNISHMENT",
      selectedPunishment: randomPunishment,
    };
  } else {
    // المحتال خسر التخمين -> الصادقون فازوا والعقاب على المحتال
    return {
      ...state,
      gameResult: "townspeople_win",
      gamePhase: "END_GAME",
      selectedPunishment: randomPunishment,
      punishmentTargetIndex: state.votedOutPlayerIndex,
    };
  }
}

export function imposterChoosesPunishmentVictim(
  state: GameState,
  victimIndex: number,
): GameState {
  const randomPunishment =
    state.selectedPunishment ||
    PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
  return {
    ...state,
    selectedPunishment: randomPunishment,
    punishmentTargetIndex: victimIndex,
    gamePhase: "END_GAME",
  };
}

export function startGameplay(state: GameState): GameState {
  return {
    ...state,
    currentPlayerIndex: Math.floor(Math.random() * state.players.length),
    gamePhase: "GAMEPLAY",
    currentRound: 0,
    questionsAsked: 0,
  };
}

export function moveToNextPlayer(state: GameState): GameState {
  const playerCount = state.players.length;
  const nextIndex = (state.currentPlayerIndex + 1) % playerCount;
  let questionsAsked = state.questionsAsked + 1;
  let currentRound = state.currentRound;

  if (questionsAsked >= playerCount) {
    questionsAsked = 0;
    currentRound += 1;
  }

  return {
    ...state,
    currentPlayerIndex: nextIndex,
    questionsAsked,
    currentRound,
    gamePhase: currentRound >= state.totalRounds ? "VOTING" : "GAMEPLAY",
  };
}

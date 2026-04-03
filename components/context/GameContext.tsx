'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  GameState,
  initializeGame,
  moveToNextPlayer,
  selectImpostor,
  handleImposterGuess,
  imposterChoosesPunishmentVictim,
  startGameplay as startGameplayLogic,
} from '@/lib/gameLogic';

type GameAction =
  | { type: 'INIT_GAME'; payload: string[] }
  | { type: 'START_GAMEPLAY' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SELECT_IMPOSTOR'; payload: number }
  | { type: 'IMPOSTOR_GUESS_WORD'; payload: string }
  | { type: 'IMPOSTOR_CHOOSE_VICTIM'; payload: number }
  | { type: 'RESET_GAME' };

interface GameContextType {
  state: GameState | null;
  dispatch: React.Dispatch<GameAction>;
  initGame: (playerNames: string[]) => void;
  startGameplay: () => void;
  nextQuestion: () => void;
  selectImpostor: (playerIndex: number) => void;
  impostorGuessWord: (word: string) => void;
  impostorChooseVictim: (playerIndex: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (!state && action.type !== 'INIT_GAME') {
    return state;
  }

  switch (action.type) {
    case 'INIT_GAME':
      return initializeGame(action.payload);

    case 'START_GAMEPLAY':
      if (!state) return null;
      return startGameplayLogic(state);

    case 'NEXT_QUESTION':
      if (!state) return null;
      return moveToNextPlayer(state);

    case 'SELECT_IMPOSTOR': {
      if (!state) return null;
      // استدعاء المنطق من gameLogic الذي يقرر الانتقال للتخمين أو الفوز المباشر
      const stateAfterVoting = selectImpostor(state, action.payload);
      
      // إذا كان الاختيار صحيحاً (كُشف المحتال)، ننتقل لمرحلة التخمين
      // وإذا كان خاطئاً، سيقوم الـ gameLogic بتعيين النتيجة لفوز المحتال
      return stateAfterVoting;
    }

    case 'IMPOSTOR_GUESS_WORD': {
      if (!state) return null;
      // استخدام الدالة المخصصة في gameLogic لمعالجة التخمين
      return handleImposterGuess(state, action.payload);
    }

    case 'IMPOSTOR_CHOOSE_VICTIM':
      if (!state) return null;
      return imposterChoosesPunishmentVictim(state, action.payload);

    case 'RESET_GAME':
      return null;

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null);

  const initGame = (playerNames: string[]) => {
    dispatch({ type: 'INIT_GAME', payload: playerNames });
  };

  const startGameplay = () => {
    dispatch({ type: 'START_GAMEPLAY' });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const selectImpostorFn = (playerIndex: number) => {
    dispatch({ type: 'SELECT_IMPOSTOR', payload: playerIndex });
  };

  const impostorGuessWord = (word: string) => {
    dispatch({ type: 'IMPOSTOR_GUESS_WORD', payload: word });
  };

  const impostorChooseVictim = (playerIndex: number) => {
    dispatch({ type: 'IMPOSTOR_CHOOSE_VICTIM', payload: playerIndex });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        initGame,
        startGameplay,
        nextQuestion,
        selectImpostor: selectImpostorFn,
        impostorGuessWord,
        impostorChooseVictim,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
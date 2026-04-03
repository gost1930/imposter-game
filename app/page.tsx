'use client';

import { useGame } from '@/components/context/GameContext';
import { SetupScreen } from '@/components/game/SetupScreen';
import { RevealCard } from '@/components/game/RevealCard';
import { GameplayRound } from '@/components/game/GameplayRound';
import { VotingPhase } from '@/components/game/VotingPhase';
import { EndGameScreen } from '@/components/game/EndGameScreen';

export default function Home() {
  const { state } = useGame();

  if (!state) {
    return <SetupScreen />;
  }

  switch (state.gamePhase) {
    case 'REVEAL_ROLES':
      return <RevealCard />;
    case 'GAMEPLAY':
      return <GameplayRound />;
    case 'VOTING':
      return <VotingPhase />;
    case 'IMPOSTER_GUESS':
    case 'imposter_guess': 
    case 'PUNISHMENT':
    case 'END_GAME':
      return <EndGameScreen />;
    default:
      return <SetupScreen />;
  }
}

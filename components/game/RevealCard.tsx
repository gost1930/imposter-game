'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/context/GameContext';

export function RevealCard() {
  const { state, startGameplay } = useGame();
  
  // UI States
  const [isPressing, setIsPressing] = useState(false);
  const [hasSeenRole, setHasSeenRole] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!state) return null;

  const currentPlayer = state.players[currentPlayerIndex];
  const isImposter = state.imposterIndices.includes(currentPlayerIndex);

  // Handlers for "Hold to Reveal"
  const handleStart = () => {
    setIsPressing(true);
    if (!hasSeenRole) setHasSeenRole(true);
  };

  const handleEnd = () => {
    setIsPressing(false);
  };

  const moveToNextPlayer = () => {
    if (currentPlayerIndex + 1 < state.players.length) {
      // Reset state for the next person
      setHasSeenRole(false);
      setIsPressing(false);
      setCurrentPlayerIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        startGameplay();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, startGameplay]);

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-black text-accent mb-4"
        >
          كل اللاعبين مستعدون!
        </motion.h2>
        <p className="text-muted-foreground">جاري تجهيز جولة الأسئلة...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 bg-background overflow-hidden">
      
      {/* Top Info Section */}
      <div className="text-center mt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent/60">
          Player {currentPlayerIndex + 1} of {state.players.length}
        </span>
        <h2 className="text-4xl font-bold mt-2">{currentPlayer.name}</h2>
        <p className="text-muted-foreground mt-2">دورك لتفقد هويتك</p>
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-[340px] aspect-[4/5] perspective-2000">
        <motion.div
          // Touch & Mouse Events
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          // Animation Logic
          animate={{ rotateY: isPressing ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full relative cursor-pointer select-none touch-none"
        >
          {/* Card Back (Hidden / Initial State) */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 bg-gradient-to-br from-accent via-accent/90 to-accent/70 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border-8 border-white/5"
          >
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/20">
              <span className="text-5xl text-white">?</span>
            </div>
            <p className="text-white font-black text-2xl">إضغط بقوة</p>
            <p className="text-white/50 text-sm mt-2">أخفِ الشاشة عن الآخرين</p>
          </div>

          {/* Card Front (Revealed State) */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 bg-card rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border-4 border-accent/20 px-8 text-center"
          >
            <div className="mb-6">
               <span className="text-7xl">{isImposter ? '🎭' : '🕵️'}</span>
            </div>
            <h3 className={`text-3xl font-black mb-4 ${isImposter ? 'text-destructive' : 'text-accent'}`}>
              {isImposter ? 'أنت المحتال' : 'أنت صادق'}
            </h3>
            
            {!isImposter && (
              <div className="w-full p-5 bg-accent/5 rounded-2xl border border-accent/10">
                <p className="text-xs text-muted-foreground uppercase mb-2">الكلمة السرية هي:</p>
                <p className="text-4xl font-black text-foreground tracking-tight">{state.word}</p>
              </div>
            )}

            {isImposter && (
              <p className="text-muted-foreground leading-relaxed">
                لا أحد يعرف أنك المحتال. <br /> استمع جيداً للأسئلة وحاول التمويه!
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-[340px] h-24 flex items-center justify-center">
        <AnimatePresence>
          {hasSeenRole && !isPressing && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={moveToNextPlayer}
              className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-[0_10px_20px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>مفهوم، مرّر الهاتف</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
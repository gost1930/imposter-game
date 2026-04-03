'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/components/context/GameContext';
import { slideUpVariants, scaleInVariants } from '@/lib/animations';

export function EndGameScreen() {
  const { state, resetGame, impostorGuessWord, impostorChooseVictim } = useGame();

  if (!state) return null;

  // 1. مرحلة "تخمين الكلمة" (تظهر عند كشف المحتال أو عند التعادل)
  // ملاحظة: هنا لا نظهر الكلمة السرية أبداً
  if (state.gamePhase === 'IMPOSTER_GUESS' || state.gamePhase === 'imposter_guess') {
    return (
      <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
        <div className="w-full max-w-md text-center space-y-8">
          <motion.div variants={scaleInVariants} className="bg-accent/10 p-8 rounded-[2.5rem] border-2 border-accent/20 shadow-2xl">
            <div className="text-5xl mb-4">🎭</div>
            <h2 className="text-3xl font-black text-accent mb-2">فرصة النجاة!</h2>
            <p className="text-muted-foreground">
               {state.votedOutPlayerIndex === null ? "حدث تعادل في الأصوات!" : "تم كشفك كـ محتال!"}
               <br />
               خمن الكلمة السرية لتربح وتختار من يتعاقب:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {state.guessOptions.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => impostorGuessWord(opt)}
                className="py-6 bg-card border-2 border-border/40 rounded-2xl text-2xl font-bold hover:border-accent hover:text-accent transition-all shadow-lg"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. مرحلة "اختيار الضحية" (إذا نجح المحتال في التخمين)
  if (state.gamePhase === 'PUNISHMENT' && (state.gameResult === 'imposters_win' || state.gameResult === 'imposter_wins')) {
    return (
      <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center min-h-screen p-6">
         <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">😈</div>
            <h2 className="text-4xl font-black text-accent mb-2">المحتال غلبكم!</h2>
            <p className="text-muted-foreground text-lg">يا محتال، اختر اللاعب الذي سيُجلد بالعقاب:</p>
         </div>
         <div className="w-full max-w-sm space-y-3">
            {state.players.map((p, idx) => (
              !state.imposterIndices.includes(idx) && (
                <Button 
                  key={p.id} 
                  onClick={() => impostorChooseVictim(idx)} 
                  className="w-full py-8 text-xl font-bold rounded-2xl bg-card border-2 border-border/40 text-foreground hover:border-accent transition-all shadow-xl"
                >
                  {p.name}
                </Button>
              )
            ))}
         </div>
      </motion.div>
    );
  }

  // 3. الشاشة النهائية (النتيجة + الكلمة + العقاب)
  const isTownWin = state.gameResult === 'townspeople_win';

  return (
    <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-between min-h-screen p-8 text-center">
      <div className="w-full max-w-md space-y-8 mt-10">
        
        <motion.div 
          variants={scaleInVariants} 
          className={`py-3 px-10 rounded-full inline-block font-black text-lg uppercase ${
            isTownWin ? 'bg-green-500 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
          }`}
        >
          {isTownWin ? 'ربح الصادقون 🎉' : 'ربح المحتال 🎭'}
        </motion.div>

        <div>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">الكلمة السرية كانت</p>
          <h2 className="text-6xl font-black text-white tracking-tighter">
            <span className="text-accent">{state.word}</span>
          </h2>
        </div>

        {/* كرت العقاب الموحد */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4, type: 'spring' }}
          className="bg-card border-4 border-dashed border-accent/40 p-8 rounded-[2.5rem] relative shadow-2xl"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-accent text-black font-black text-xs rounded-full">
            قائمة العقاب
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase mb-1">الضحية (المعاقب)</p>
              <p className="text-4xl font-black text-white">
                {state.punishmentTargetIndex !== null ? state.players[state.punishmentTargetIndex].name : 'المحتال'}
              </p>
            </div>
            
            <div className="h-[1px] bg-border w-1/3 mx-auto" />
            
            <div>
              <p className="text-muted-foreground text-xs uppercase mb-1">نوع العقاب</p>
              <p className="text-2xl font-bold text-accent italic">
                "{state.selectedPunishment || "عقاب عشوائي"}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Button 
        onClick={resetGame} 
        className="w-full max-w-sm py-8 rounded-2xl bg-white text-black font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all mb-10"
      >
        جولة جديدة
      </Button>
    </motion.div>
  );
}
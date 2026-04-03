'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/components/context/GameContext';
import { slideUpVariants, containerVariants, itemVariants, scaleInVariants } from '@/lib/animations';

export function EndGameScreen() {
  const { state, resetGame, impostorGuessWord, impostorChooseVictim } = useGame();
  const [guessResult, setGuessResult] = useState<'success' | 'fail' | null>(null);

  if (!state) return null;

  // توليد خيارات للمحتال (الكلمة الصحيحة + كلمتين تمويه)
  // ملاحظة: يفضل أن تأتي هذه الخيارات من الـ Context أو JSON الكلمات لديك
  const guessOptions = [state.word, "كلمة 1", "كلمة 2"].sort(() => Math.random() - 0.5);

  const handleWordGuess = (selectedWord: string) => {
    if (selectedWord === state.word) {
      setGuessResult('success');
      // هنا نقوم بتحديث الحالة في الـ Context ليكون المحتال هو الفائز
    } else {
      setGuessResult('fail');
    }
  };

  // 1. مرحلة تخمين الكلمة (فرصة المحتال الأخيرة)
  if (state.gamePhase === 'imposter_guess') {
    return (
      <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
        <div className="w-full max-w-md text-center space-y-8">
          <motion.div variants={scaleInVariants} className="bg-accent/10 p-6 rounded-[2rem] border-2 border-accent/20">
            <h2 className="text-3xl font-black text-accent mb-2">الفرصة الأخيرة! 🎭</h2>
            <p className="text-muted-foreground text-sm">أنت مكشوف، لكن إذا عرفت الكلمة السرية ستفوز وتنتقم!</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {guessOptions.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordGuess(opt)}
                className="py-5 bg-card border-2 border-border/40 rounded-2xl text-xl font-bold hover:border-accent transition-all"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. مرحلة اختيار الضحية (إذا فاز المحتال)
  if (state.gameResult === 'imposter_wins' && state.punishmentTargetIndex === null) {
    return (
      <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center min-h-screen p-6">
         <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-destructive mb-2">المحتال فاز! 😈</h2>
            <p className="text-muted-foreground">اختر اللاعب الذي سيجلد بالعقاب:</p>
         </div>
         <div className="w-full max-w-sm space-y-3">
            {state.players.map((p, idx) => (
              !state.imposterIndices.includes(idx) && (
                <Button key={p.id} onClick={() => impostorChooseVictim(idx)} className="w-full py-7 text-lg rounded-2xl bg-card border-2 border-border text-foreground hover:bg-accent/10">
                  {p.name}
                </Button>
              )
            ))}
         </div>
      </motion.div>
    );
  }

  // 3. النتيجة النهائية والعقاب
  return (
    <motion.div variants={slideUpVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-between min-h-screen p-8">
      <div className="w-full max-w-md text-center space-y-6 mt-10">
        <motion.div variants={scaleInVariants} className={`py-3 px-8 rounded-full inline-block font-black text-sm uppercase ${state.gameResult === 'townspeople_win' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
          {state.gameResult === 'townspeople_win' ? 'ربح الصادقون 🎉' : 'ربح المحتال 🎭'}
        </motion.div>

        <h2 className="text-5xl font-black tracking-tighter">الكلمة هي: <br/> <span className="text-accent">{state.word}</span></h2>

        {/* كرت العقاب - يظهر دائماً */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-card border-4 border-dashed border-accent/30 p-8 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 bg-accent text-black font-black text-xs">PUNISHMENT</div>
          <p className="text-muted-foreground text-xs mb-2 uppercase tracking-widest">المعاقب: {state.punishmentTargetIndex !== null ? state.players[state.punishmentTargetIndex].name : 'المحتال'}</p>
          <p className="text-2xl font-bold leading-tight">{state.selectedPunishment || "لا يوجد عقاب مسجل"}</p>
        </motion.div>
      </div>

      <Button onClick={resetGame} className="w-full max-w-sm py-8 rounded-2xl bg-white text-black font-black text-xl shadow-2xl active:scale-95 mb-10">
        لعبة جديدة
      </Button>
    </motion.div>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/components/context/GameContext';
import { slideUpVariants, containerVariants, itemVariants } from '@/lib/animations';

export function GameplayRound() {
  const { state, nextQuestion } = useGame();

  if (!state) return null;

  // اللاعب الذي عليه الدور الآن (ليسأل أو يجيب حسب اتفاقكم)
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // حساب عدد الأسئلة المتبقية في هذه الجولة
  const questionsInCurrentRound = state.questionsAsked % state.players.length;
  const remainingInRound = state.players.length - questionsInCurrentRound;

  return (
    <motion.div
      variants={slideUpVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-between min-h-screen p-6 bg-background"
    >
      {/* Header - Round Info */}
      <div className="w-full text-center mt-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-widest">
            الجولة {state.currentRound + 1} / {state.totalRounds}
          </span>
        </motion.div>
        
        <h2 className="text-muted-foreground text-lg mb-1">الآن دور اللاعب:</h2>
        <motion.h3 
          key={currentPlayer.name}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black text-foreground tracking-tight"
        >
          {currentPlayer.name}
        </motion.h3>
      </div>

      {/* Main Focus Area - Action Card */}
      <div className="w-full max-w-sm">
        <motion.div
          className="bg-card border-2 border-accent/20 rounded-[2.5rem] p-8 shadow-2xl text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">تكلم الآن!</p>
            <p className="text-muted-foreground leading-relaxed">
              قم بطرح سؤالك على أحد اللاعبين، أو أجب على السؤال الموجه إليك بذكاء.
            </p>
          </div>

          {/* Turn Progress Dots */}
          <div className="flex justify-center gap-2 pt-4">
            {state.players.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                  idx === state.currentPlayerIndex ? 'w-8 bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="w-full max-w-sm mb-8 space-y-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
             بقي {remainingInRound} لاعبين في هذه الجولة
          </p>
          
          <Button
            onClick={nextQuestion}
            className="w-full py-8 text-xl font-black rounded-2xl bg-white text-black hover:bg-white/90 shadow-xl active:scale-95 transition-all group"
          >
            <span>انتهينا، التالي</span>
            <motion.span 
              className="ml-2 inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Button>
        </div>

        {/* Quick Hint */}
        <p className="text-center text-[10px] text-muted-foreground/50 uppercase">
          تذكر: المحتال يحاول التمويه والصادق يحاول كشفه دون فضح الكلمة
        </p>
      </div>
    </motion.div>
  );
}
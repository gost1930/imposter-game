'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/context/GameContext';
import { Button } from '@/components/ui/button'; // تأكد من وجوده في مشروعك
import { RefreshCcw, AlertCircle } from 'lucide-react'; // مكتبة الأيقونات الافتراضية في shadcn

export function RevealCard() {
  const { state, startGameplay, resetGame } = useGame();
  
  // UI States
  const [isPressing, setIsPressing] = useState(false);
  const [hasSeenRole, setHasSeenRole] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!state) return null;

  const currentPlayer = state.players[currentPlayerIndex];
  const isImposter = state.imposterIndices.includes(currentPlayerIndex);

  const handleStart = () => {
    setIsPressing(true);
    if (!hasSeenRole) setHasSeenRole(true);
  };

  const handleEnd = () => setIsPressing(false);

  const moveToNextPlayer = () => {
    if (currentPlayerIndex + 1 < state.players.length) {
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
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h2 className="text-4xl font-black text-accent mb-4">كل اللاعبين مستعدون!</h2>
          <p className="text-muted-foreground">جاري تجهيز جولة الأسئلة...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 bg-background overflow-hidden relative">
      
      {/* --- زر إعادة اللعبة العلوي --- */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowResetConfirm(true)}
          className="rounded-full bg-card/50 border border-border/40 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* --- نافذة تأكيد الإعادة (Overlay) --- */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-card border-2 border-border p-8 rounded-[2rem] max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">إعادة تشغيل اللعبة؟</h3>
                <p className="text-muted-foreground text-sm">سيتم تغيير الكلمات وتوزيع الأدوار من جديد. هل أنت متأكد؟</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl py-6" onClick={() => setShowResetConfirm(false)}>تراجع</Button>
                <Button variant="destructive" className="flex-1 rounded-xl py-6 font-bold" onClick={resetGame}>نعم، أعد</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="text-center mt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent/60">
          لاعب {currentPlayerIndex + 1} من {state.players.length}
        </span>
        <h2 className="text-4xl font-bold mt-2 tracking-tighter">{currentPlayer.name}</h2>
        <p className="text-muted-foreground mt-2">دورك لتفقد هويتك</p>
      </div>

      {/* Card Section */}
      <div className="relative w-full max-w-[340px] aspect-[4/5] perspective-2000">
        <motion.div
          onMouseDown={handleStart} onMouseUp={handleEnd} onMouseLeave={handleEnd}
          onTouchStart={handleStart} onTouchEnd={handleEnd}
          animate={{ rotateY: isPressing ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full relative cursor-pointer select-none touch-none"
        >
          {/* Card Back */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 bg-gradient-to-br from-accent via-accent/90 to-accent/70 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border-8 border-white/5"
          >
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/20">
              <span className="text-5xl text-white">?</span>
            </div>
            <p className="text-white font-black text-2xl uppercase">إضغط مطولاً</p>
            <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">أخفِ الشاشة عن الآخرين</p>
          </div>

          {/* Card Front */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 bg-card rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border-4 border-accent/20 px-8 text-center"
          >
            <div className="mb-6"><span className="text-7xl">{isImposter ? '🎭' : '🕵️'}</span></div>
            <h3 className={`text-3xl font-black mb-4 ${isImposter ? 'text-destructive' : 'text-accent'}`}>
              {isImposter ? 'أنت المحتال' : 'أنت صادق'}
            </h3>
            
            {!isImposter ? (
              <div className="w-full p-5 bg-accent/5 rounded-2xl border border-accent/10">
                <p className="text-xs text-muted-foreground uppercase mb-2">الكلمة السرية:</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">{state.word}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                لا أحد يعرف هويتك. استمع جيداً للأسئلة وحاول التمويه لكي لا تنكشف!
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
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={moveToNextPlayer}
              className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>مفهوم، مرّر الهاتف</span>
              <RefreshCcw className="w-4 h-4 rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/components/context/GameContext';
import { slideUpVariants, buttonHoverVariants, containerVariants, itemVariants } from '@/lib/animations';

export function SetupScreen() {
  const { initGame } = useGame();
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [isStarting, setIsStarting] = useState(false);

  // 1. عند تشغيل الصفحة: استرجاع الأسماء المحفوظة
  useEffect(() => {
    const savedNames = localStorage.getItem('imposter_players');
    if (savedNames) {
      const parsedNames = JSON.parse(savedNames) as string[];
      setPlayerCount(parsedNames.length);
      setPlayerNames(parsedNames);
    }
  }, []);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    // محاولة الحفاظ على الأسماء القديمة عند تغيير العدد بدلاً من مسحها بالكامل
    const newNames = Array(count).fill('').map((_, i) => playerNames[i] || '');
    setPlayerNames(newNames);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const allFilled = playerNames.every((name) => name.trim().length > 0);
    
    if (allFilled) {
      setIsStarting(true);
      // 2. حفظ الأسماء في localStorage قبل بدء اللعبة
      localStorage.setItem('imposter_players', JSON.stringify(playerNames));
      initGame(playerNames);
    }
  };

  const allFilled = playerNames.every((name) => name.trim().length > 0);

  return (
    <motion.div
      variants={slideUpVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-card/50 p-4"
    >
      <motion.div className="w-full max-w-md space-y-8">
        {/* Title */}
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="text-center space-y-2">
          <motion.h1 variants={itemVariants} className="text-5xl font-black text-accent tracking-tighter">
            المحتال
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground text-sm font-medium">
            لعبة الذكاء والتمويه الجماعية
          </motion.p>
        </motion.div>

        {/* Player Count Selection */}
        <motion.div variants={slideUpVariants} className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">
              عدد اللاعبين
            </label>
            <span className="text-accent font-black">{playerCount}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6, 7, 8].map((count) => (
              <motion.button
                key={count}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlayerCountChange(count)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                  playerCount === count
                    ? 'bg-accent border-accent text-black shadow-[0_0_15px_rgba(var(--accent),0.3)]'
                    : 'bg-card border-border/40 text-muted-foreground hover:border-accent/50'
                }`}
              >
                {count}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Player Input Fields */}
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {playerNames.map((name, index) => (
            <motion.div key={index} variants={itemVariants} className="relative group">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent/40 group-focus-within:text-accent">
                {index + 1}
              </span>
              <Input
                type="text"
                placeholder="اسم اللاعب..."
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full py-6 pr-10 bg-card border-2 border-border/40 focus:border-accent rounded-xl text-right font-bold transition-all"
                maxLength={15}
                disabled={isStarting}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.div variants={slideUpVariants} className="pt-4">
          <Button
            onClick={handleStart}
            disabled={!allFilled || isStarting}
            className={`w-full py-8 text-xl font-black rounded-2xl shadow-2xl transition-all active:scale-95 ${
              allFilled 
              ? 'bg-white text-black hover:bg-white/90 shadow-white/10' 
              : 'bg-muted text-muted-foreground'
            }`}
          >
            {isStarting ? 'جاري التحميل...' : 'ابدأ التحدي ⚡'}
          </Button>
          
          <p className="text-center text-[10px] text-muted-foreground/50 mt-4 uppercase tracking-[0.2em]">
            يتم حفظ الأسماء تلقائياً لجولتك القادمة
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
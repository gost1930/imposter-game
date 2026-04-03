'use client';

import { useState } from 'react';
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

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const validNames = playerNames.filter((name) => name.trim().length > 0);
    if (validNames.length === playerCount && playerNames.every((name) => name.trim().length > 0)) {
      setIsStarting(true);
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
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center space-y-2"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold text-accent">
            المحتال
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground text-sm">
            لعبة محتال مثيرة ومضحكة
          </motion.p>
          <motion.p variants={itemVariants} className="text-xs text-muted-foreground/70">
            كل سؤال مهم، وكل إجابة تحتسب!
          </motion.p>
        </motion.div>

        {/* Player Count Selection */}
        <motion.div
          variants={slideUpVariants}
          className="space-y-3"
        >
          <label className="block text-xs font-medium text-foreground/70">
            اختر عدد اللاعبين
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlayerCountChange(count)}
                className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                  playerCount === count
                    ? 'bg-accent text-primary-foreground'
                    : 'bg-card border border-border/50 text-foreground hover:border-accent'
                }`}
              >
                {count}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Player Input Fields */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {playerNames.map((name, index) => (
            <motion.div key={index} variants={itemVariants}>
              <label className="block text-xs font-medium text-foreground/70 mb-2">
                اللاعب {index + 1}
              </label>
              <Input
                type="text"
                placeholder={`أدخل اسم اللاعب ${index + 1}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/50 rtl"
                maxLength={20}
                disabled={isStarting}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions */}
        <motion.div
          variants={slideUpVariants}
          className="bg-card/50 border border-border/30 rounded-lg p-4 space-y-2"
        >
          <h3 className="font-semibold text-sm text-accent">كيفية اللعب:</h3>
          <ul className="text-xs text-foreground/70 space-y-1 text-right">
            <li>• يشوف كل لاعب البطاقة الخاصة بيه (محتال أو كلمة سرية)</li>
            <li>• اللعبة تختار من يبدأ يسأل</li>
            <li>• كل لاعب يسأل سؤال في دوره</li>
            <li>• تصوتوا على من تعتقدون أنه المحتال</li>
            <li>• إذا اخطأتم، المحتال يختار عقار!</li>
          </ul>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={slideUpVariants}>
          <motion.div
            whileHover={allFilled ? 'hover' : ''}
            whileTap={allFilled ? 'tap' : ''}
            variants={buttonHoverVariants}
          >
            <Button
              onClick={handleStart}
              disabled={!allFilled || isStarting}
              className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-bold py-3 text-lg"
            >
              {isStarting ? 'جاري البدء...' : 'ابدأ اللعبة'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={slideUpVariants}
          className="text-center text-xs text-muted-foreground/50"
        >
          مرر الهاتف، احفظ السر!
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

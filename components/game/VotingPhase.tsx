"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/components/context/GameContext";
import {
  slideUpVariants,
  containerVariants,
  itemVariants,
} from "@/lib/animations";

export function VotingPhase() {
  const { state, selectImpostor } = useGame();

  // تتبع من الذي يصوت الآن
  const [voterIndex, setVoterIndex] = useState(0);
  // تخزين جميع الأصوات (Key: voterId, Value: votedForPlayerId)
  const [votes, setVotes] = useState<Record<number, number>>({});
  // اللاعب المختار حالياً من قبل المصوت الحالي
  const [currentSelection, setCurrentSelection] = useState<number | null>(null);
  // حالة انتهاء الجميع من التصويت
  const [isVotingComplete, setIsVotingComplete] = useState(false);

  if (!state) return null;

  const currentVoter = state.players[voterIndex];

  const handleConfirmVote = () => {
    if (currentSelection === null) return;

    const updatedVotes = { ...votes, [currentVoter.id]: currentSelection };
    setVotes(updatedVotes);
    setCurrentSelection(null);

    if (voterIndex + 1 < state.players.length) {
      setVoterIndex(voterIndex + 1);
    } else {
      // الجميع صوتوا! الآن نحسب النتيجة ونرسلها للـ Context
      calculateFinalResult(updatedVotes);
    }
  };

  const calculateFinalResult = (allVotes: Record<number, number>) => {
    setIsVotingComplete(true);

    // 1. حساب التكرارات
    const counts: Record<number, number> = {};
    Object.values(allVotes).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    // 2. إيجاد أعلى عدد أصوات وصل له أي لاعب
    const maxVotes = Math.max(...Object.values(counts));

    // 3. معرفة من هم اللاعبون الذين حصلوا على هذا العدد (maxVotes)
    const candidates = Object.keys(counts).filter(
      (id) => counts[Number(id)] === maxVotes,
    );

    setTimeout(() => {
      // حالة التعادل: إذا كان هناك أكثر من مرشح بنفس عدد الأصوات
      if (candidates.length > 1) {
        // ننتقل لمرحلة التخمين مباشرة للمحتال (كأنه نجا من التصويت)
        // سنرسل index المحتال الحقيقي ليدافع عن نفسه
        selectImpostor(state.imposterIndices[0]);
      } else {
        // حالة وجود فائز واحد بالتصويت
        selectImpostor(Number(candidates[0]));
      }
    }, 2000);
  };

  if (isVotingComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-4xl font-black text-accent mb-4">
            انتهى التصويت!
          </h2>
          <p className="text-muted-foreground">
            جاري فرز الأصوات وكشف الحقيقة...
          </p>
          <div className="mt-8 text-6xl animate-bounce">🗳️</div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={slideUpVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-between min-h-screen p-6 bg-background"
    >
      {/* Header */}
      <div className="text-center mt-6">
        <p className="text-accent font-bold uppercase tracking-tighter text-sm">
          مرحلة التصويت السري
        </p>
        <h2 className="text-3xl font-black mt-2">
          دور {currentVoter.name} ليصوت
        </h2>
        <div className="flex gap-1 justify-center mt-3">
          {state.players.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full transition-all ${idx <= voterIndex ? "bg-accent" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Voting Cards */}
      <div className="w-full max-w-md grid grid-cols-1 gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={voterIndex}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {state.players.map((player) => (
              <motion.button
                key={player.id}
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentSelection(player.id)}
                className={`w-full p-5 rounded-2xl border-2 text-right flex justify-between items-center transition-all ${
                  currentSelection === player.id
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(var(--accent),0.2)]"
                    : "border-border/40 bg-card/50"
                }`}
              >
                {currentSelection === player.id && (
                  <span className="text-accent">●</span>
                )}
                <span
                  className={`text-xl font-bold ${currentSelection === player.id ? "text-accent" : ""}`}
                >
                  {player.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-md mb-8">
        <Button
          onClick={handleConfirmVote}
          disabled={currentSelection === null}
          className="w-full py-7 text-xl font-black rounded-2xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95"
        >
          تأكيد تصويت {currentVoter.name}
        </Button>
        <p className="text-center text-muted-foreground text-xs mt-4 uppercase">
          مرّر الهاتف لكل لاعب ليصوت دون أن يراه أحد
        </p>
      </div>
    </motion.div>
  );
}

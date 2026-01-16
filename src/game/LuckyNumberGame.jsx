import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaStar } from "react-icons/fa6";

export default function LuckyNumberGame() {
  const [betAmount, setBetAmount] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const MAX_NUMBER = 25;

  const handlePlay = () => {
    if (selectedNumber === null || isSpinning) return;

    setIsSpinning(true);
    setWinningNumber(null);
    setGameResult(null);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setWinningNumber(Math.floor(Math.random() * MAX_NUMBER) + 1);
      spins++;
      if (spins > maxSpins) {
        clearInterval(interval);
        finishSpin();
      }
    }, 100);
  };

  const finishSpin = () => {
    const finalNumber = Math.floor(Math.random() * MAX_NUMBER) + 1;
    setWinningNumber(finalNumber);
    setIsSpinning(false);

    if (finalNumber === selectedNumber) {
      setGameResult("win");
    } else {
      setGameResult("lose");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaStar className="text-yellow-500" /> Lucky Number
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Pick a number between 1 and {MAX_NUMBER}. Win 24x your bet!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Bet Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) =>
                      setBetAmount(Math.max(0.1, parseFloat(e.target.value)))
                    }
                    min="0.1"
                    step="0.5"
                    disabled={isSpinning}
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg p-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                    MON
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 25].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    disabled={isSpinning}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 rounded transition-colors"
                  >
                    {amt}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-950/50 p-4 rounded-xl border border-dashed border-zinc-800 text-center">
                <span className="text-zinc-500 text-xs uppercase block mb-1">
                  Your Pick
                </span>
                <span
                  className={`text-3xl font-bold ${
                    selectedNumber ? "text-indigo-400" : "text-zinc-700"
                  }`}
                >
                  {selectedNumber ?? "?"}
                </span>
              </div>

              <button
                onClick={handlePlay}
                disabled={selectedNumber === null || isSpinning}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] mt-4 ${
                  selectedNumber === null
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : isSpinning
                    ? "bg-indigo-900/50 text-indigo-300 cursor-wait"
                    : "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-amber-900/20"
                }`}
              >
                {isSpinning ? "Drawing..." : "Place Bet"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {gameResult === "win" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-center shadow-lg text-white"
              >
                <FaTrophy className="text-4xl mx-auto mb-2 text-yellow-300 drop-shadow-md" />
                <h3 className="text-2xl font-bold">WINNER!</h3>
                <p className="font-mono text-lg opacity-90">
                  +{(betAmount * 24).toFixed(2)} MON
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50" />

          <div className="grid grid-cols-5 gap-3 w-full max-w-md relative z-10">
            {Array.from({ length: MAX_NUMBER }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedNumber === num;
              const isWinning = winningNumber === num;
              let stateClass =
                "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500";

              if (isWinning) {
                stateClass =
                  "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] z-20 scale-110";
              } else if (isSelected) {
                stateClass =
                  "bg-indigo-600 text-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/30 z-10";
              }

              return (
                <motion.button
                  key={num}
                  onClick={() => !isSpinning && setSelectedNumber(num)}
                  className={`aspect-square rounded-xl border-2 font-bold text-xl flex items-center justify-center transition-all duration-100 ${stateClass} ${
                    isSpinning && !isWinning ? "opacity-50" : "opacity-100"
                  }`}
                  whileHover={!isSpinning ? { scale: 1.05 } : {}}
                  whileTap={!isSpinning ? { scale: 0.95 } : {}}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>

          {isSpinning && (
            <div className="mt-6 text-yellow-500 font-mono animate-pulse">
              Drawing Winning Number...
            </div>
          )}

          {!isSpinning && !gameResult && (
            <p className="mt-6 text-zinc-500 text-sm">
              Select a number to begin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

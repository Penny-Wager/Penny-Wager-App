import React, { useState } from "react";
import { FaAnchor, FaCrown } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function CoinFlipGame() {
  const [coinState, changeCoinState] = useState(false);
  const [isFlipping, flipCoin] = useState(false);
  const [isGamePlayed, setPlayed] = useState(false);
  const [attempts, incAttempts] = useState(0);
  const [betAmount, changeBetAmount] = useState(0.1);
  const [userSideGuess, makeGuess] = useState("Heads");

  function flip() {
    const decider = Math.random();
    if (decider > 0.5) {
      changeCoinState(true);
    } else {
      changeCoinState(false);
    }
  }

  function checker() {
    if (userSideGuess === "Heads" && coinState) {
      return "Won";
    } else if (userSideGuess === "Tails" && !coinState) {
      return "Won";
    } else {
      return "Lost";
    }
  }

  const handleFlip = () => {
    flipCoin(true);
    setPlayed(false);
    flip();

    incAttempts((prev) => prev + 1);

    setTimeout(() => {
      flipCoin(false);
      setPlayed(true);
    }, 2000);
  };

  const isWon = checker() === "Won";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid md:grid-cols-2 gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex flex-col space-y-6 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Coin Flip</h2>
            <p className="text-zinc-400 text-sm">
              Double your bet with a 50/50 chance.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Attempts</span>
              <span className="font-mono text-zinc-200 bg-zinc-700 px-2 py-1 rounded">
                {attempts}/5
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Choose Side
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => makeGuess("Heads")}
                  disabled={isGamePlayed || attempts >= 5 || isFlipping}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    userSideGuess === "Heads"
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  <FaCrown size={16} /> Heads
                </button>
                <button
                  onClick={() => makeGuess("Tails")}
                  disabled={isGamePlayed || attempts >= 5 || isFlipping}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    userSideGuess === "Tails"
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  <FaAnchor size={16} /> Tails
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Bet Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => changeBetAmount(e.target.value)}
                  step="0.01"
                  min="0.1"
                  max="2.0"
                  disabled={isFlipping || attempts >= 5}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg p-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  MON
                </span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1 px-1">
                <span>Min: 0.1</span>
                <span>Max: 2.0</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFlip}
            disabled={attempts >= 5 || isFlipping || (isGamePlayed && !isWon)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              attempts >= 5
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : isFlipping
                ? "bg-indigo-700 text-indigo-200 cursor-wait"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-900/20"
            }`}
          >
            {isFlipping
              ? "Flipping..."
              : attempts >= 5
              ? "Max Attempts Reached"
              : "Flip Coin"}
          </button>
        </div>

        <div className="bg-black/40 rounded-xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
          <AnimatePresence>
            {isGamePlayed && !isFlipping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-0 w-full text-center z-20"
              >
                <div
                  className={`inline-block px-4 py-2 rounded-full border ${
                    isWon
                      ? "bg-green-500/10 border-green-500/50 text-green-400"
                      : "bg-red-500/10 border-red-500/50 text-red-400"
                  } font-bold`}
                >
                  {isWon ? "YOU WON!" : "YOU LOST"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative perspective-[1000px] w-48 h-48">
            <motion.div
              className={`w-full h-full relative preserve-3d transition-all duration-100 placeholderCoin`}
              animate={{
                rotateY: isFlipping ? 1800 : 0,
              }}
              transition={{
                duration: isFlipping ? 2 : 0,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`w-48 h-48 rounded-full absolute inset-0 flex items-center justify-center border-4 shadow-[0_0_50px_rgba(234,179,8,0.2)] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-amber-600`}
              >
                {(isFlipping ||
                  (!coinState && !isFlipping && !isGamePlayed)) && (
                  <FaCrown className="text-amber-900 drop-shadow-md text-6xl" />
                )}
                {!isFlipping && isGamePlayed && coinState && (
                  <FaCrown className="text-amber-900 drop-shadow-md text-6xl" />
                )}
                {!isFlipping && isGamePlayed && !coinState && (
                  <FaAnchor className="text-amber-900 drop-shadow-md text-6xl" />
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center h-12">
            {!isFlipping && isGamePlayed && (
              <div className="space-y-2">
                <p className="text-zinc-300 text-lg">
                  Result:{" "}
                  <span className="font-bold text-amber-400">
                    {coinState ? "Heads" : "Tails"}
                  </span>
                </p>
                {isWon && (
                  <button
                    onClick={() => setPlayed(false)}
                    className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-full transition-colors"
                  >
                    Collect Winnings
                  </button>
                )}
                {!isWon && (
                  <button
                    onClick={() => setPlayed(false)}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-1.5 rounded-full transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
            {!isGamePlayed && !isFlipping && (
              <p className="text-zinc-500 text-sm">
                Place your bet and flip to win.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

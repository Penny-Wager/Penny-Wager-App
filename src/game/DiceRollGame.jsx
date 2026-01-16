import React, { useState } from "react";
import {
  FaDiceOne,
  FaDiceTwo,
  FaDiceThree,
  FaDiceFour,
  FaDiceFive,
  FaDiceSix,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function DiceRollGame() {
  const [isRolling, setIsRolling] = useState(false);
  const [betAmount, setBetAmount] = useState(0.1);
  const [selectedSide, setSelectedSide] = useState(null);
  const [result, setResult] = useState(1);
  const [resultType, setResultType] = useState(null);
  const [history, setHistory] = useState([]);

  const handleRoll = () => {
    if (!selectedSide) return;

    setIsRolling(true);
    setResultType(null);

    setTimeout(() => {
      const newResult = Math.floor(Math.random() * 6) + 1;
      setResult(newResult);
      setIsRolling(false);

      const isWin = checkWin(newResult, selectedSide);
      setResultType(isWin ? "win" : "lose");
      setHistory((prev) => [newResult, ...prev].slice(0, 10));
    }, 1500);
  };

  const checkWin = (roll, side) => {
    if (side === "even") return roll % 2 === 0;
    if (side === "odd") return roll % 2 !== 0;
    return roll === side;
  };

  const getMultiplier = (side) => {
    if (side === "even" || side === "odd") return 1.96;
    return 5.88;
  };

  const DiceIcon = ({ value, className = "" }) => {
    switch (value) {
      case 1:
        return <FaDiceOne className={className} />;
      case 2:
        return <FaDiceTwo className={className} />;
      case 3:
        return <FaDiceThree className={className} />;
      case 4:
        return <FaDiceFour className={className} />;
      case 5:
        return <FaDiceFive className={className} />;
      case 6:
        return <FaDiceSix className={className} />;
      default:
        return <FaDiceOne className={className} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid md:grid-cols-2 gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col space-y-6 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Dice Roll</h2>
            <p className="text-zinc-400 text-sm">
              Predict the roll. Win up to 5.88x your bet.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Bet Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                  step="0.1"
                  min="0.1"
                  max="10.0"
                  disabled={isRolling}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg p-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  MON
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Prediction
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedSide(num)}
                    disabled={isRolling}
                    className={`py-3 rounded-lg border font-bold flex items-center justify-center transition-all ${
                      selectedSide === num
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/40"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    <DiceIcon
                      value={num}
                      className="mr-2"
                    />{" "}
                    {num}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedSide("even")}
                  disabled={isRolling}
                  className={`py-3 rounded-lg border font-bold uppercase text-xs tracking-wider transition-all ${
                    selectedSide === "even"
                      ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  Even (1.96x)
                </button>
                <button
                  onClick={() => setSelectedSide("odd")}
                  disabled={isRolling}
                  className={`py-3 rounded-lg border font-bold uppercase text-xs tracking-wider transition-all ${
                    selectedSide === "odd"
                      ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  Odd (1.96x)
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-700/50">
              <span className="text-zinc-500">Payout Multiplier</span>
              <span className="text-zinc-200 font-mono">
                {selectedSide ? `${getMultiplier(selectedSide)}x` : "-"}
              </span>
            </div>
          </div>

          <button
            onClick={handleRoll}
            disabled={!selectedSide || isRolling}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              !selectedSide
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : isRolling
                ? "bg-indigo-700 text-indigo-200 cursor-wait"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            }`}
          >
            {isRolling ? "Rolling..." : "Roll Dice"}
          </button>
        </div>

        <div className="bg-black/40 rounded-xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative min-h-[350px]">
          <div className="relative w-40 h-40 flex items-center justify-center perspective-[1000px]">
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  animate={{
                    rotateX: [0, 360, 720, 1080],
                    rotateY: [0, 360, 720, 1080],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="text-8xl text-indigo-500 opacity-80"
                >
                  <FaDiceThree />
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  className={`text-9xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] ${
                    resultType === "win"
                      ? "text-green-500"
                      : resultType === "lose"
                      ? "text-zinc-500"
                      : "text-zinc-200"
                  }`}
                >
                  <DiceIcon value={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-16 mt-6 flex items-center justify-center w-full">
            {!isRolling && resultType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-6 py-2 rounded-full border font-bold text-lg ${
                  resultType === "win"
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-zinc-700/30 border-zinc-600 text-zinc-400"
                }`}
              >
                {resultType === "win"
                  ? `WIN! +${(betAmount * getMultiplier(selectedSide)).toFixed(
                      2
                    )} MON`
                  : "Missed! Try Again."}
              </motion.div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-1">
            {history.map((h, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                  selectedSide && checkWin(h, selectedSide)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                }`}
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

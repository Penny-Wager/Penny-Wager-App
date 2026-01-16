import React, { useState } from "react";
import { GiHearts, GiSpades, GiClubs, GiDiamonds } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

export default function CardPickGame() {
  const [isShuffling, setShuffleStatus] = useState(false);
  const [attempts, addAttempt] = useState(0);
  const [betMultiplier, updateMultiplier] = useState(1.0);
  const [betValue, updateBet] = useState(0.1);
  const [selectedValue, selectNewValue] = useState("");
  const [selectedSuit, selectNewSuit] = useState("");

  const [gameState, setGameState] = useState("idle");
  const [resultCard, setResultCard] = useState({ suit: "", value: "" });

  function luckyChoose() {
    const suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
    const values = [
      "K",
      "Q",
      "J",
      "10",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "A",
    ];
    const lucky_suit = suits[Math.floor(Math.random() * suits.length)];
    const lucky_value = values[Math.floor(Math.random() * values.length)];
    return { suit: lucky_suit, value: lucky_value };
  }

  function handlePlay() {
    setGameState("shuffling");
    setShuffleStatus(true);

    const result = luckyChoose();
    setResultCard(result);

    setTimeout(() => {
      setShuffleStatus(false);
      setGameState("revealed");
      addAttempt((prev) => prev + 1);
    }, 2000);
  }

  function resetGame() {
    setGameState("idle");
    selectNewSuit("");
    selectNewValue("");
    setResultCard({ suit: "", value: "" });
  }

  function CardIcon({ suit, size = "md" }) {
    const className = size === "lg" ? "text-6xl" : "text-2xl";
    switch (suit) {
      case "Hearts":
        return <GiHearts className={`${className} text-red-600`} />;
      case "Diamonds":
        return <GiDiamonds className={`${className} text-red-600`} />;
      case "Spades":
        return <GiSpades className={`${className} text-black`} />;
      case "Clubs":
        return <GiClubs className={`${className} text-black`} />;
      default:
        return null;
    }
  }

  const PlayingCard = ({ value, suit, isFaceDown = false, className = "" }) => {
    if (isFaceDown) {
      return (
        <div
          className={`w-40 h-60 bg-indigo-900 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center ${className}`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #312e81 10px, #3730a3 10px, #3730a3 20px, #312e81 20px)",
          }}
        >
          <div className="w-20 h-20 rounded-full bg-indigo-500/50 flex items-center justify-center border-2 border-indigo-300">
            <span className="text-white text-3xl font-bold">?</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`w-40 h-60 bg-white rounded-xl shadow-2xl relative p-4 flex flex-col justify-between select-none ${className}`}
      >
        <div className="flex flex-col items-center top-2 left-2 absolute">
          <span
            className={`text-2xl font-bold ${
              suit === "Hearts" || suit === "Diamonds"
                ? "text-red-600"
                : "text-black"
            }`}
          >
            {value}
          </span>
          <CardIcon
            suit={suit}
            size="sm"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <CardIcon
            suit={suit}
            size="lg"
          />
        </div>

        <div className="flex flex-col items-center bottom-2 right-2 absolute rotate-180">
          <span
            className={`text-2xl font-bold ${
              suit === "Hearts" || suit === "Diamonds"
                ? "text-red-600"
                : "text-black"
            }`}
          >
            {value}
          </span>
          <CardIcon
            suit={suit}
            size="sm"
          />
        </div>
      </div>
    );
  };

  const isWin =
    resultCard.suit === selectedSuit && resultCard.value === selectedValue;
  const isSuitWin =
    resultCard.suit === selectedSuit && resultCard.value !== selectedValue;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid md:grid-cols-12 gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="md:col-span-5 flex flex-col space-y-6 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Card Pick</h2>
            <p className="text-zinc-400 text-sm">
              Guess the card correctly to win big multipliers.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Attempts Remaining</span>
              <span className="font-mono text-zinc-200 bg-zinc-700 px-2 py-1 rounded">
                {3 - attempts}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Value
                </label>
                <select
                  value={selectedValue}
                  onChange={(e) => selectNewValue(e.target.value)}
                  disabled={gameState !== "idle" || attempts >= 3}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select
                  </option>
                  {[
                    "K",
                    "Q",
                    "J",
                    "10",
                    "9",
                    "8",
                    "7",
                    "6",
                    "5",
                    "4",
                    "3",
                    "2",
                    "A",
                  ].map((v) => (
                    <option
                      key={v}
                      value={v}
                    >
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Suit
                </label>
                <select
                  value={selectedSuit}
                  onChange={(e) => selectNewSuit(e.target.value)}
                  disabled={gameState !== "idle" || attempts >= 3}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select
                  </option>
                  {["Spades", "Hearts", "Clubs", "Diamonds"].map((s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Bet Amount ({betMultiplier}x)
              </label>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={betValue}
                  onChange={(e) => updateBet(e.target.value)}
                  step="0.01"
                  min="0.1"
                  max="5.0"
                  disabled={gameState !== "idle"}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg p-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  MON
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1.25, 1.34, 2.43, 4.23].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateMultiplier(m)}
                    disabled={gameState !== "idle"}
                    className={`text-xs py-1.5 rounded-md font-mono transition-colors ${
                      betMultiplier === m
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    x{m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-700/50 flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Potential Win</span>
              <span className="text-xl font-bold text-green-400 font-mono">
                {(betValue * betMultiplier).toFixed(4)} MON
              </span>
            </div>
          </div>

          <button
            onClick={handlePlay}
            disabled={
              !selectedValue ||
              !selectedSuit ||
              gameState !== "idle" ||
              attempts >= 3
            }
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              !selectedValue || !selectedSuit || attempts >= 3
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : gameState === "shuffling"
                ? "bg-indigo-700 text-indigo-200 cursor-wait"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            }`}
          >
            {gameState === "shuffling"
              ? "Shuffling..."
              : attempts >= 3
              ? "Game Over"
              : "Reveal Card"}
          </button>
        </div>

        <div className="md:col-span-7 bg-black/40 rounded-xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="text-zinc-500 text-xs text-right">
              <p>YOUR PICK</p>
              <p className="text-white font-bold">
                {selectedValue || "?"} of {selectedSuit || "?"}
              </p>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {gameState === "idle" && (
                <motion.div
                  key="face-down"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                >
                  <PlayingCard isFaceDown />
                </motion.div>
              )}

              {gameState === "shuffling" && (
                <motion.div
                  key="shuffling"
                  animate={{
                    x: [0, -20, 20, -10, 10, 0],
                    rotateY: [0, 180, 360, 540],
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <PlayingCard
                    isFaceDown
                    className="shadow-indigo-500/20"
                  />
                </motion.div>
              )}

              {gameState === "revealed" && (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <PlayingCard
                    value={resultCard.value}
                    suit={resultCard.suit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-20 mt-8 w-full flex items-center justify-center">
            {gameState === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-zinc-400 mb-2">
                  The card was{" "}
                  <span className="text-white font-bold">
                    {resultCard.value} of {resultCard.suit}
                  </span>
                </p>

                {isWin ? (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-2 rounded-full font-bold text-lg mb-2">
                    PERFECT MATCH! You Win!
                  </div>
                ) : isSuitWin ? (
                  <div className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 px-6 py-2 rounded-full font-bold text-lg mb-2">
                    Correct Suit! Small Win.
                  </div>
                ) : (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-full font-bold text-lg mb-2">
                    No Match. Try Again.
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className="text-sm text-zinc-400 hover:text-white underline"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

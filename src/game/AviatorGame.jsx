import React, { useState, useEffect, useRef } from "react";
import { useWeb3 } from "../context/Web3Context";
import { parseEther, formatEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FaHistory, FaInfoCircle, FaCheck, FaPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ABI of your Aviator smart contract
const aviatorContractAbi = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cashOut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getPlayerBet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentMultiplier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isGameActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "hasPlayerCashedOut",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "multiplier",
        type: "uint256",
      },
    ],
    name: "CashedOut",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "crashPoint",
        type: "uint256",
      },
    ],
    name: "GameCrashed",
    type: "event",
  },
];

// Replace with your actual contract address
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

const AviatorGame = () => {
  // Game states
  const [betAmount, setBetAmount] = useState("0.1");
  const [autoCashoutValue, setAutoCashoutValue] = useState("2.0");
  const [multiplier, setMultiplier] = useState(1.0);
  const [gamePhase, setGamePhase] = useState("waiting"); // waiting, flying, crashed
  const [recentResults, setRecentResults] = useState([
    1.25, 2.5, 1.16, 4.2, 1.87,
  ]);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);

  // Animation refs
  const planeRef = useRef(null);
  const multiplierTimerRef = useRef(null);
  const gameTimerRef = useRef(null);

  // Access web3 context
  const { account, isConnected, isOnMonadChain, switchToMonadChain } =
    useWeb3();

  // Wagmi hooks
  const { writeContractAsync: placeBet } = useWriteContract();
  const { writeContractAsync: cashOut } = useWriteContract();
  const { data: placeBetTxHash, isPending: isPlacingBet } = useWriteContract();
  const { data: cashOutTxHash, isPending: isCashingOut } = useWriteContract();

  // Processing transaction state
  const { isLoading: isPlaceBetProcessing } = useWaitForTransactionReceipt({
    hash: placeBetTxHash,
  });

  const { isLoading: isCashOutProcessing } = useWaitForTransactionReceipt({
    hash: cashOutTxHash,
  });

  const isProcessing =
    isPlacingBet || isPlaceBetProcessing || isCashingOut || isCashOutProcessing;

  // Read contract data for player bet
  const { data: playerBetData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: aviatorContractAbi,
    functionName: "getPlayerBet",
    args: [account],
    enabled: isConnected && account,
    watch: true,
  });

  // Check if game is active
  const { data: isGameActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: aviatorContractAbi,
    functionName: "isGameActive",
    watch: true,
  });

  // Handle placing bet
  const handlePlaceBet = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!isOnMonadChain()) {
      await switchToMonadChain();
      return;
    }

    try {
      await placeBet({
        address: CONTRACT_ADDRESS,
        abi: aviatorContractAbi,
        functionName: "placeBet",
        args: [parseEther(betAmount)],
      });

      setHasBet(true);
      setHasCashedOut(false);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  // Handle cashing out
  const handleCashOut = async () => {
    if (!hasBet || hasCashedOut) return;

    try {
      await cashOut({
        address: CONTRACT_ADDRESS,
        abi: aviatorContractAbi,
        functionName: "cashOut",
      });

      setHasCashedOut(true);
    } catch (error) {
      console.error("Error cashing out:", error);
    }
  };

  // Sample simulation for game flow
  useEffect(() => {
    if (gamePhase === "waiting") {
      // Start a new game after 3 seconds
      gameTimerRef.current = setTimeout(() => {
        setGamePhase("flying");
        startFlying();
      }, 3000);
    }

    return () => {
      if (multiplierTimerRef.current) clearInterval(multiplierTimerRef.current);
      if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };
  }, [gamePhase]);

  // Start the multiplier increasing
  const startFlying = () => {
    let currentMultiplier = 1.0;
    let speed = 0.01;
    const crashPoint = generateCrashPoint();

    setMultiplier(currentMultiplier);

    multiplierTimerRef.current = setInterval(() => {
      currentMultiplier += speed;
      speed += 0.001;
      setMultiplier(currentMultiplier);

      // Check for auto cashout
      if (
        hasBet &&
        !hasCashedOut &&
        parseFloat(autoCashoutValue) <= currentMultiplier
      ) {
        handleCashOut();
      }

      // Check for crash
      if (currentMultiplier >= crashPoint) {
        clearInterval(multiplierTimerRef.current);
        setGamePhase("crashed");

        // Add the crash point to recent results
        setRecentResults((prev) => [
          parseFloat(crashPoint.toFixed(2)),
          ...prev.slice(0, 4),
        ]);

        // Reset after 3 seconds
        setTimeout(() => {
          setGamePhase("waiting");
          setMultiplier(1.0);
          setHasBet(false);
          setHasCashedOut(false);
        }, 3000);
      }
    }, 100);
  };

  // Generate a random crash point (weighted toward lower values)
  const generateCrashPoint = () => {
    // This is a simple implementation - the smart contract would use a provably fair algorithm
    const random = Math.random();
    return 1 + Math.pow(Math.random() * 0.99, -1) / 10;
  };

  // Format the multiplier for display
  const formatMultiplier = (value) => {
    if (value < 2) return value.toFixed(2);
    if (value < 10) return value.toFixed(1);
    return Math.floor(value);
  };

  // Color based on multiplier
  const getMultiplierColor = () => {
    if (multiplier < 1.5) return "text-white";
    if (multiplier < 2) return "text-yellow-400";
    if (multiplier < 5) return "text-orange-400";
    if (multiplier < 10) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
       

        {/* Game Main Area */}
        <div className="flex flex-col md:flex-row">
          {/* Game Visuals */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center relative min-h-64 bg-black">
            <div className="relative w-full h-64 overflow-hidden">
              {/* Sky Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-zinc-950" />

              {/* Multiplier */}
              <AnimatePresence>
                {gamePhase === "flying" && (
                  <motion.div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-5xl ${getMultiplierColor()}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                  >
                    {formatMultiplier(multiplier)}x
                  </motion.div>
                )}

                {gamePhase === "crashed" && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-4xl text-red-500"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                  >
                    CRASHED @ {formatMultiplier(multiplier)}x
                  </motion.div>
                )}

                {gamePhase === "waiting" && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Next round starting...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Plane Animation */}
              <AnimatePresence>
                {gamePhase === "flying" && (
                  <motion.div
                    ref={planeRef}
                    className="absolute bottom-8 left-8"
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{
                      x: `${Math.min(multiplier * 20, 300)}%`,
                      y: `-${Math.min(multiplier * 10, 200)}%`,
                      rotate: 15,
                    }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <FaPlane className="text-indigo-400 text-3xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent Results */}
            <div className="mt-4 flex space-x-2">
              {recentResults.map((result, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    result < 1.5
                      ? "bg-red-900 text-red-100"
                      : result < 2
                      ? "bg-yellow-800 text-yellow-100"
                      : result < 5
                      ? "bg-green-800 text-green-100"
                      : "bg-purple-800 text-purple-100"
                  }`}
                >
                  {result.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-80 bg-zinc-800 p-4 border-l border-zinc-700">
            <div className="mb-6">
              <div className="text-gray-300 mb-2">Bet Amount</div>
              <div className="flex">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={hasBet || isProcessing || gamePhase === "flying"}
                  className="flex-1 bg-zinc-700 text-white p-2 rounded-l-md border border-zinc-600 focus:outline-none focus:border-indigo-500"
                  step="0.01"
                  min="0.01"
                />
                <div className="bg-zinc-900 p-2 rounded-r-md border border-l-0 border-zinc-600 text-gray-300">
                  MON
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  onClick={() =>
                    setBetAmount((prev) => (parseFloat(prev) / 2).toFixed(2))
                  }
                  disabled={hasBet || isProcessing || gamePhase === "flying"}
                  className="bg-zinc-700 text-gray-300 p-1 rounded text-sm hover:bg-zinc-600 disabled:opacity-50"
                >
                  ½
                </button>
                <button
                  onClick={() =>
                    setBetAmount((prev) => (parseFloat(prev) * 2).toFixed(2))
                  }
                  disabled={hasBet || isProcessing || gamePhase === "flying"}
                  className="bg-zinc-700 text-gray-300 p-1 rounded text-sm hover:bg-zinc-600 disabled:opacity-50"
                >
                  2×
                </button>
                <button
                  onClick={() => setBetAmount("0.1")}
                  disabled={hasBet || isProcessing || gamePhase === "flying"}
                  className="bg-zinc-700 text-gray-300 p-1 rounded text-sm hover:bg-zinc-600 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-300 mb-2">Auto Cash Out</div>
              <div className="flex">
                <input
                  type="number"
                  value={autoCashoutValue}
                  onChange={(e) => setAutoCashoutValue(e.target.value)}
                  disabled={hasBet || isProcessing}
                  className="flex-1 bg-zinc-700 text-white p-2 rounded-l-md border border-zinc-600 focus:outline-none focus:border-indigo-500"
                  step="0.1"
                  min="1.1"
                />
                <div className="bg-zinc-900 p-2 rounded-r-md border border-l-0 border-zinc-600 text-gray-300">
                  ×
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!hasBet ? (
                <button
                  onClick={handlePlaceBet}
                  disabled={
                    !isConnected ||
                    isProcessing ||
                    gamePhase === "flying" ||
                    parseFloat(betAmount) <= 0
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-600 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Bet"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCashOut}
                  disabled={
                    !isConnected ||
                    hasCashedOut ||
                    isProcessing ||
                    gamePhase !== "flying"
                  }
                  className={`w-full font-medium py-3 px-4 rounded-md transition-colors ${
                    hasCashedOut
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white disabled:bg-zinc-600 disabled:opacity-50`}
                >
                  {hasCashedOut ? (
                    <span className="flex items-center justify-center">
                      <FaCheck className="mr-2" />
                      Cashed Out!
                    </span>
                  ) : isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Cash Out (${formatMultiplier(multiplier)}x)`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviatorGame;

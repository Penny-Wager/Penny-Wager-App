import React, { useState, useEffect, useRef } from "react";
import { useWeb3 } from "../context/Web3Context";
import { parseEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FaCheck, FaPlane } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

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

const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

const AviatorGame = () => {
  const [betAmount, setBetAmount] = useState("0.1");
  const [autoCashoutValue, setAutoCashoutValue] = useState("2.0");
  const [multiplier, setMultiplier] = useState(10.0);
  const [gamePhase, setGamePhase] = useState("waiting");
  const [recentResults, setRecentResults] = useState([
    1.25, 2.5, 1.16, 4.2, 1.87,
  ]);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(null);

  const planeRef = useRef(null);
  const multiplierTimerRef = useRef(null);
  const gameTimerRef = useRef(null);

  const { account, isConnected, isOnMonadChain, switchToMonadChain } =
    useWeb3();

  const { writeContract, isPending: isPendingWrite } = useWriteContract();
  const [placeBetTxHash, setPlaceBetTxHash] = useState(null);
  const [cashOutTxHash, setCashOutTxHash] = useState(null);

  const { isLoading: isPlaceBetProcessing } = useWaitForTransactionReceipt({
    hash: placeBetTxHash,
    enabled: !!placeBetTxHash,
  });

  const { isLoading: isCashOutProcessing } = useWaitForTransactionReceipt({
    hash: cashOutTxHash,
    enabled: !!cashOutTxHash,
  });

  const isProcessing =
    isPendingWrite || isPlaceBetProcessing || isCashOutProcessing;

  const { data: playerBetData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: aviatorContractAbi,
    functionName: "getPlayerBet",
    args: [account],
    enabled: isConnected && !!account,
    watch: true,
  });

  const { data: isGameActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: aviatorContractAbi,
    functionName: "isGameActive",
    watch: true,
  });

  const handlePlaceBet = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!isOnMonadChain()) {
      const switched = await switchToMonadChain();
      if (!switched) return;
    }

    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: aviatorContractAbi,
        functionName: "placeBet",
        args: [parseEther(betAmount)],
      });

      setPlaceBetTxHash(hash);
      setHasBet(true);
      setHasCashedOut(false);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  const handleCashOut = async () => {
    if (!hasBet || hasCashedOut) return;

    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: aviatorContractAbi,
        functionName: "cashOut",
      });

      setCashOutTxHash(hash);
      setHasCashedOut(true);
    } catch (error) {
      console.error("Error cashing out:", error);
    }
  };

  useEffect(() => {
    if (gamePhase === "waiting") {
      const newCrashPoint = generateCrashPoint();
      setCrashPoint(newCrashPoint);

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

  const startFlying = () => {
    let currentMultiplier = 1.0;
    let speed = 0.01;

    if (!crashPoint) {
      console.error("No crash point set!");
      return;
    }

    setMultiplier(currentMultiplier);

    multiplierTimerRef.current = setInterval(() => {
      currentMultiplier += speed;
      speed += 0.001;
      setMultiplier(currentMultiplier);

      if (
        hasBet &&
        !hasCashedOut &&
        parseFloat(autoCashoutValue) <= currentMultiplier
      ) {
        handleCashOut();
      }

      if (currentMultiplier >= crashPoint) {
        clearInterval(multiplierTimerRef.current);
        setGamePhase("crashed");

        setRecentResults((prev) => [
          parseFloat(crashPoint.toFixed(2)),
          ...prev.slice(0, 4),
        ]);

        setTimeout(() => {
          setGamePhase("waiting");
          setMultiplier(1.0);
          setHasBet(false);
          setHasCashedOut(false);
          setCrashPoint(null);
        }, 3000);
      }
    }, 100);
  };

  const generateCrashPoint = () => {
    const random = Math.random();
    const exponentialValue = -Math.log(1 - random * 0.99) / 0.1;
    const crashPoint = 1.0 + exponentialValue * 6.0;

    const finalCrashPoint = Math.min(100, crashPoint);
    const rounded = parseFloat(finalCrashPoint.toFixed(2));

    return rounded;
  };

  const formatMultiplier = (value) => {
    if (value < 2) return value.toFixed(2);
    if (value < 10) return value.toFixed(1);
    return Math.floor(value);
  };

  const getMultiplierColor = () => {
    if (multiplier < 1.5) return "text-white";
    if (multiplier < 2) return "text-yellow-400";
    if (multiplier < 5) return "text-orange-400";
    if (multiplier < 10) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid md:grid-cols-12 gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="md:col-span-8 bg-black/40 rounded-xl border border-zinc-800 relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex-1 relative overflow-hidden">
             
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-900/0 to-zinc-900/0" />
            
             <AnimatePresence>
                {gamePhase === 'flying' && (
                    <motion.div
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-6xl md:text-8xl ${getMultiplierColor()} z-20`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                    >
                        {formatMultiplier(multiplier)}x
                    </motion.div>
                )}

                {gamePhase === 'crashed' && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                    >
                        <span className="font-bold text-5xl md:text-7xl text-red-500 font-mono mb-2">FLEW AWAY!</span>
                         <span className="text-xl text-red-400 font-mono bg-red-900/30 px-4 py-1 rounded-full border border-red-500/30">
                            @{formatMultiplier(multiplier)}x
                         </span>
                    </motion.div>
                )}

                {gamePhase === 'waiting' && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="text-4xl font-bold text-white mb-2">Next Round in</div>
                         <div className="w-16 h-1 bg-zinc-700 rounded-full mx-auto overflow-hidden">
                            <motion.div 
                                className="h-full bg-indigo-500"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 2.8, ease: "linear" }}
                            />
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {gamePhase === 'flying' && (
                    <motion.div 
                        ref={planeRef}
                        className="absolute bottom-12 left-12 z-10"
                         initial={{ x: 0, y: 0, rotate: 0 }}
                          animate={{ 
                                x: `${Math.min(multiplier * 30, 400)}%`,
                                y: `-${Math.min(multiplier * 15, 250)}%`,
                                rotate: 12
                           }}
                           transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    >
                        <div className="relative">
                            <FaPlane className="text-indigo-400 text-6xl drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                             <motion.div 
                                className="absolute -left-4 top-1/2 w-20 h-1 bg-indigo-500/50 blur-sm rounded-full"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 80 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg className="absolute bottom-0 left-0 w-full h-32 text-zinc-800/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 L0 50 Q 25 60 50 50 T 100 50 L 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="bg-zinc-950/50 border-t border-zinc-800 p-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-zinc-500 text-xs uppercase font-bold px-2 whitespace-nowrap">Recent:</span>
                {recentResults.map((result, i) => (
                    <div
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap ${
                            result < 1.5 ? 'bg-zinc-800 text-zinc-400' :
                            result < 2.0 ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30' :
                            'bg-purple-900/30 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        }`}
                    >
                        {result.toFixed(2)}x
                    </div>
                ))}
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
            <div>
                 <h2 className="text-2xl font-bold text-white mb-1">Aviator</h2>
                <p className="text-zinc-400 text-sm">Cash out before the plane flies away!</p>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 flex flex-col gap-5">
                
                <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Bet Amount
                    </label>
                    <div className="flex rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700">
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            disabled={hasBet || isProcessing || gamePhase === 'flying'}
                            className="flex-1 bg-transparent text-white p-3 font-mono focus:outline-none"
                            step="0.01"
                            min="0.01"
                        />
                         <div className="bg-zinc-800 px-3 flex items-center text-zinc-400 text-sm border-l border-zinc-700">MON</div>
                    </div>
                     <div className="grid grid-cols-4 gap-2 mt-2">
                        <button 
                            onClick={() => setBetAmount((parseFloat(betAmount) / 2).toFixed(2))}
                            disabled={hasBet || isProcessing || gamePhase === 'flying'}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs py-1.5 rounded transition-colors"
                        >½</button>
                        <button 
                            onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(2))}
                            disabled={hasBet || isProcessing || gamePhase === 'flying'}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs py-1.5 rounded transition-colors"
                        >2x</button>
                         <button 
                            onClick={() => setBetAmount((1).toFixed(2))}
                            disabled={hasBet || isProcessing || gamePhase === 'flying'}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs py-1.5 rounded transition-colors"
                        >Min</button>
                         <button 
                            onClick={() => setBetAmount((100).toFixed(2))}
                            disabled={hasBet || isProcessing || gamePhase === 'flying'}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs py-1.5 rounded transition-colors"
                        >Max</button>
                     </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Auto Cash Out
                    </label>
                    <div className="flex rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700">
                         <input
                            type="number"
                            value={autoCashoutValue}
                            onChange={(e) => setAutoCashoutValue(e.target.value)}
                            disabled={hasBet || isProcessing}
                             className="flex-1 bg-transparent text-white p-3 font-mono focus:outline-none"
                            step="0.1"
                            min="1.1"
                        />
                         <div className="bg-zinc-800 px-3 flex items-center text-zinc-400 text-sm border-l border-zinc-700">x</div>
                    </div>
                </div>

                <div className="pt-2">
                     {!hasBet ? (
                        <button
                            onClick={handlePlaceBet}
                            disabled={!isConnected || isProcessing || gamePhase === 'flying' || parseFloat(betAmount) <= 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                                !isConnected || isProcessing || gamePhase === 'flying'
                                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed" 
                                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20"
                            }`}
                        >
                            {isProcessing ? "Processing..." : "Place Bet"}
                        </button>
                     ) : (
                         <button
                            onClick={handleCashOut}
                            disabled={!isConnected || hasCashedOut || isProcessing || gamePhase !== 'flying'}
                             className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex flex-col items-center justify-center leading-tight ${
                                hasCashedOut 
                                ? "bg-zinc-700 text-green-400 border border-green-500/20" 
                                : gamePhase !== 'flying'
                                ? "bg-zinc-700 text-zinc-500"
                                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-900/20"
                             }`}
                        >
                             {hasCashedOut ? (
                                <>
                                    <span>CASHED OUT</span>
                                    <span className="text-sm opacity-80">Waiting for next round</span>
                                </>
                             ) : gamePhase !== 'flying' ? (
                                 "Wait for Next Round"
                             ) : (
                                 <>
                                    <span>CASH OUT</span>
                                    <span className="text-sm font-mono">{(parseFloat(betAmount) * multiplier).toFixed(2)} MON</span>
                                 </>
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

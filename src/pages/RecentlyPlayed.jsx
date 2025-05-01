import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaPlay, FaHistory, FaTrash } from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";
import { GAMES_DATA } from "../utils/data/games";

const MOCK_RECENT_DATA = [
  {
    gameId: "coin-flip",
    lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timesPlayed: 5,
    lastBet: 0.1,
    winnings: 0.3,
  },
  {
    gameId: "card-game",
    lastPlayed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timesPlayed: 2,
    lastBet: 1,
    winnings: -1,
  },
  {
    gameId: "dice-roll",
    lastPlayed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timesPlayed: 10,
    lastBet: 0.2,
    winnings: 1.5,
  },
];

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

const RecentGameCard = ({ game, recentData, onToggleFavorite, isFavorite }) => {
  const { account } = useWeb3();

  return (
    <motion.div
      className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex flex-col h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Game Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800">
        {/* Placeholder for game image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">{game.name.charAt(0)}</span>
        </div>

        {/* Favorite button */}
        {account && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-opacity-70"
          >
            <FaStar
              className={isFavorite ? "text-yellow-400" : "text-gray-400"}
            />
          </button>
        )}

        {/* Last played badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 rounded-md text-xs text-gray-300 flex items-center">
          <FaHistory className="mr-1" />
          {formatTimeAgo(recentData.lastPlayed)}
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>

        {/* Play Stats */}
        <div className="mb-4 text-sm">
          <div className="flex justify-between mb-1 text-gray-400">
            <span>Times played:</span>
            <span className="text-gray-300">{recentData.timesPlayed}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Last bet:</span>
            <span className="text-gray-300">{recentData.lastBet} MON</span>
          </div>
        </div>

        {/* Winnings */}
        <div className="mb-4 pb-3 border-b border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Winnings:</span>
            <span
              className={
                recentData.winnings >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              {recentData.winnings > 0 ? "+" : ""}
              {recentData.winnings} MON
            </span>
          </div>
        </div>

        {/* Play Button */}
        <Link
          to={`/games/${game.id}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center mt-auto"
        >
          <FaPlay
            className="mr-2"
            size={14}
          />
          Play Again
        </Link>
      </div>
    </motion.div>
  );
};

// Main Recently Played component
const RecentlyPlayed = () => {
  const [recentGames, setRecentGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { account } = useWeb3();

  // Load recent games and favorites on mount
  useEffect(() => {
    if (account) {
      // In a real app, this would be loaded from localStorage or API
      // For demo, we'll use the mock data

      // Fetch game details for each recent game
      const gamesWithDetails = MOCK_RECENT_DATA.map((recentData) => {
        const gameDetails = GAMES_DATA.find(
          (game) => game.id === recentData.gameId
        );
        return gameDetails
          ? {
              ...gameDetails,
              recentData,
            }
          : null;
      }).filter(Boolean);

      setRecentGames(gamesWithDetails);

      // Load favorites
      try {
        const savedFavorites = localStorage.getItem(`favorites_${account}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    } else {
      setRecentGames([]);
      setFavorites([]);
    }
  }, [account]);

  // Toggle favorite status
  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) => {
      let newFavorites;
      if (prev.includes(gameId)) {
        newFavorites = prev.filter((id) => id !== gameId);
      } else {
        newFavorites = [...prev, gameId];
      }

      // Save to localStorage
      if (account) {
        localStorage.setItem(
          `favorites_${account}`,
          JSON.stringify(newFavorites)
        );
      }

      return newFavorites;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <motion.div
        className="mb-6 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Recently Played
          </h1>
          <p className="text-gray-400">
            Games you've played recently on Penny Wager
          </p>
        </div>
      </motion.div>

      {/* Content based on wallet connection and history */}
      {!account ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <FaHistory className="text-gray-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to see your recently played games
          </p>
        </div>
      ) : recentGames.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {recentGames.map((game) => (
            <RecentGameCard
              key={game.id}
              game={game}
              recentData={game.recentData}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(game.id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <FaHistory className="text-gray-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Recent Activity
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't played any games recently
          </p>
          <Link
            to="/games"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md transition-colors duration-200 inline-flex items-center"
          >
            Browse Games
          </Link>
        </div>
      )}
    </div>
  );
};


export default RecentlyPlayed;

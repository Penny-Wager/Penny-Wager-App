import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaHistory, FaPlay } from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";
import { useTheme } from "../context/ThemeContext";
import { GAMES_DATA } from "../utils/data/games";

// Game card component
const GameCard = ({ game, onToggleFavorite, isFavorite }) => {
  const { account } = useWeb3();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
      } rounded-lg overflow-hidden border flex flex-col h-full shadow-md`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Game Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-40 sm:h-48 md:h-48 object-cover"
          />
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
      </div>

      {/* Game Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          {game.name}
        </h3>
        <p
          className={`${
            isDark ? "text-gray-400" : "text-gray-600"
          } text-sm mb-4 flex-1`}
        >
          {game.description}
        </p>

        {/* Game Details */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex justify-between mb-1">
            <span>Min Bet:</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              {game.minBet} MON
            </span>
          </div>
          <div className="flex justify-between">
            <span>Max Bet:</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              {game.maxBet} MON
            </span>
          </div>
        </div>

        {/* Play Button */}
        <Link
          to={`/games/${game.id}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <FaPlay
            className="mr-2"
            size={14}
          />
          Play Now
        </Link>
      </div>
    </motion.div>
  );
};

// Filter tabs component
const FilterTabs = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tabs = [
    { id: "all", label: "All Games" },
    { id: "featured", label: "Featured" },
    { id: "popular", label: "Popular" },
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-indigo-600 text-white"
              : isDark
              ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};

// Main Games component
const Games = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const { account } = useWeb3();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const category = searchParams.get("category");

  // Get games based on category and active tab
  const getFilteredGames = () => {
    let filteredGames = [...GAMES_DATA];

    // Apply category filter if present
    if (category) {
      filteredGames = filteredGames.filter(
        (game) => game.category === category
      );
    }

    // Apply tab filter
    if (activeTab === "featured") {
      filteredGames = filteredGames.filter((game) => game.featured);
    } else if (activeTab === "popular") {
      filteredGames = filteredGames.filter((game) => game.popular);
    }

    return filteredGames;
  };

  // Toggle favorite status
  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) => {
      if (prev.includes(gameId)) {
        return prev.filter((id) => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  // Get category title
  const getCategoryTitle = () => {
    if (!category) return "All Games";

    const categoryMap = {
      "casino-games": "Casino Games",
      "lottery-games": "Lottery Games",
      "card-games": "Card Games",
    };

    return categoryMap[category] || "Games";
  };

  // Load favorites and recently played from localStorage on mount
  useEffect(() => {
    if (account) {
      try {
        const savedFavorites = localStorage.getItem(`favorites_${account}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        const savedRecent = localStorage.getItem(`recent_${account}`);
        if (savedRecent) {
          setRecentlyPlayed(JSON.parse(savedRecent));
        }
      } catch (error) {
        console.error("Error loading saved game data:", error);
      }
    }
  }, [account]);

  // Save favorites to localStorage when changed
  useEffect(() => {
    if (account && favorites.length > 0) {
      localStorage.setItem(`favorites_${account}`, JSON.stringify(favorites));
    }
  }, [favorites, account]);

  const filteredGames = getFilteredGames();

  return (
    <div
      className={`container mx-auto px-4 py-8 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      {/* Page header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          {getCategoryTitle()}
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          {category
            ? `Browse our selection of ${getCategoryTitle().toLowerCase()}`
            : "Browse all games available on Penny Wager"}
        </p>
      </motion.div>

      {/* Filter tabs */}
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Games grid */}
      {filteredGames.length > 0 ? (
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
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(game.id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            No games found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Games;

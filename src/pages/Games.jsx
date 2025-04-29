import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaHistory, FaPlay } from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";

const GAMES_DATA = [
  {
    id: "coin-flip",
    name: "Coin Flip",
    description: "50/50 chance to double your bet",
    category: "casino",
    image: "/images/coin-flip.jpg",
    minBet: 0.01,
    maxBet: 10,
    featured: true,
    popular: true,
  },
  {
    id: "dice-roll",
    name: "Dice Roll",
    description: "Roll the dice and win big",
    category: "casino",
    image: "/images/dice-roll.jpg",
    minBet: 0.05,
    maxBet: 5,
    featured: true,
    popular: false,
  },
  {
    id: "lucky-number",
    name: "Lucky Number",
    description: "Pick your lucky number and win",
    category: "slot-games",
    image: "/images/lucky-number.jpg",
    minBet: 0.1,
    maxBet: 20,
    featured: false,
    popular: true,
  },
  {
    id: "card-pick",
    name: "Card Pick",
    description: "Pick a card and test your luck",
    category: "slot-games",
    image: "/images/card-pick.jpg",
    minBet: 0.02,
    maxBet: 8,
    featured: false,
    popular: false,
  },
  {
    id: "lottery-game",
    name: "Lucky Draw",
    description: "Weekly lottery with massive prizes",
    category: "lottery",
    image: "/images/lottery.jpg",
    minBet: 0.5,
    maxBet: 10,
    featured: true,
    popular: true,
  },
  {
    id: "scratch-card",
    name: "Scratch Card",
    description: "Scratch and win instantly",
    category: "lottery",
    image: "/images/scratch-card.jpg",
    minBet: 0.2,
    maxBet: 2,
    featured: false,
    popular: true,
  },
];

// Game card component
const GameCard = ({ game, onToggleFavorite, isFavorite }) => {
  const { account } = useWeb3();

  return (
    <motion.div
      className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex flex-col h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
      </div>

      {/* Game Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-1">{game.description}</p>

        {/* Game Details */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex justify-between mb-1">
            <span>Min Bet:</span>
            <span className="text-gray-300">{game.minBet} MON</span>
          </div>
          <div className="flex justify-between">
            <span>Max Bet:</span>
            <span className="text-gray-300">{game.maxBet} MON</span>
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
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
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
      casino: "Casino Games",
      "slot-games": "Slot Games",
      lottery: "Lottery Games",
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
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          {getCategoryTitle()}
        </h1>
        <p className="text-gray-400">
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
          <p className="text-gray-400 text-lg">
            No games found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Games;

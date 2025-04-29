import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaPlay, FaTimes } from "react-icons/fa";
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
];

// Favorite Game Card component
const FavoriteGameCard = ({ game, onRemoveFavorite }) => {
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

        {/* Favorite indicator and remove button */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <FaStar className="text-yellow-400" />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveFavorite(game.id);
            }}
            className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-red-600"
          >
            <FaTimes className="text-white" />
          </button>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-1">{game.description}</p>

        {/* Game Category Badge */}
        <div className="mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-300">
            {game.category === "casino"
              ? "Casino"
              : game.category === "slot-games"
              ? "Slot Game"
              : game.category === "lottery"
              ? "Lottery"
              : "Game"}
          </span>
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

// Main Favorites component
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const { account } = useWeb3();

  useEffect(() => {
    if (account) {
      try {
        const savedFavorites = localStorage.getItem(`favorites_${account}`);
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);

          const games = GAMES_DATA.filter((game) =>
            parsedFavorites.includes(game.id)
          );
          setFavoriteGames(games);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    } else {
      setFavorites([]);
      setFavoriteGames([]);
    }
  }, [account]);

  const handleRemoveFavorite = (gameId) => {
    const updatedFavorites = favorites.filter((id) => id !== gameId);
    setFavorites(updatedFavorites);
    setFavoriteGames((prev) => prev.filter((game) => game.id !== gameId));

    // Save to localStorage
    if (account) {
      localStorage.setItem(
        `favorites_${account}`,
        JSON.stringify(updatedFavorites)
      );
    }
  };

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
          Your Favorite Games
        </h1>
        <p className="text-gray-400">
          Quick access to your favorite games on Penny Wager
        </p>
      </motion.div>

      {/* Content based on wallet connection and favorites */}
      {!account ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <FaStar className="text-yellow-400 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to see and manage your favorite games
          </p>
        </div>
      ) : favoriteGames.length > 0 ? (
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
          {favoriteGames.map((game) => (
            <FavoriteGameCard
              key={game.id}
              game={game}
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <FaStar className="text-gray-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Favorites Yet
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't added any games to your favorites yet
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

export default Favorites;

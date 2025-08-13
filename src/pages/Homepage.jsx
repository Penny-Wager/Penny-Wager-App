import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaFire,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import { GAMES_DATA } from "../utils/data/games";
import { useTheme } from "../context/ThemeContext";

export default function Homepage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("all");
  const [filteredGames, setFilteredGames] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Filter games based on active tab
    if (activeTab === "all") {
      setFilteredGames(GAMES_DATA);
    } else {
      setFilteredGames(
        GAMES_DATA.filter((game) => game.category === activeTab)
      );
    }
  }, [activeTab]);

  // Get featured games
  const featuredGames = GAMES_DATA.filter((game) => game.featured);

  // Get popular games
  const popularGames = GAMES_DATA.filter((game) => game.popular);

  return (
    <div
      className={`${
        isDark ? "bg-black text-gray-300" : "bg-white text-gray-800"
      } min-h-screen pb-8`}
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 mt-4 md:mt-8">
        {/* Featured Games Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-2 text-lg md:text-xl" />
              <h2
                className={`text-lg md:text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Featured Games
              </h2>
            </div>
            <div className="flex space-x-1 md:space-x-2">
              <button
                className={`border p-1 cursor-pointer rounded hover:transition-colors duration-200 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FaChevronLeft className="text-sm md:text-base" />
              </button>
              <button
                className={`border p-1 cursor-pointer rounded hover:transition-colors duration-200 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FaChevronRight className="text-sm md:text-base" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {featuredGames.map((game) => (
              <div
                key={game.id}
                className="transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-indigo-900 to-zinc-900 border border-indigo-700 rounded-xl overflow-hidden shadow-2xl relative h-full">
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded-md text-xs z-10">
                    FEATURED
                  </div>
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover p-1 md:p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="p-3 md:p-4 relative z-10">
                    <h3 className="font-bold text-base md:text-lg text-white mb-1">
                      {game.name}
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4 min-h-[2.5rem]">
                      {game.description}
                    </p>
                    <Link
                      className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold py-1.5 md:py-2 px-4 md:px-8 rounded-lg w-full transform transition-transform duration-300"
                     to={`/games/${game.id}`}
                     >
                      PLAY NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Games Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center">
              <FaFire className="text-red-500 mr-2 text-lg md:text-xl" />
              <h2
                className={`text-lg md:text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Popular Games
              </h2>
            </div>
            <div className="flex space-x-1 md:space-x-2">
              <button
                className={`border p-1 cursor-pointer rounded hover:transition-colors duration-200 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FaChevronLeft className="text-sm md:text-base" />
              </button>
              <button
                className={`border p-1 cursor-pointer rounded hover:transition-colors duration-200 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FaChevronRight className="text-sm md:text-base" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {popularGames.map((game) => (
              <div
                key={game.id}
                className="group transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-red-900 to-zinc-900 border border-red-700 rounded-xl overflow-hidden shadow-2xl relative h-full">
                  <div className="absolute top-2 left-2 bg-red-500 text-white font-bold px-2 py-1 rounded-md text-xs z-10">
                    POPULAR
                  </div>
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover p-1 md:p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="p-3 md:p-4 relative z-10">
                    <h3 className="font-bold text-base md:text-lg text-white mb-1">
                      {game.name}
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4 min-h-[2.5rem]">
                      {game.description}
                    </p>
                    <button
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-1.5 md:py-2 px-4 md:px-8 rounded-lg w-full transform transition-transform duration-300"
                      onClick={() => navigate(`/games/${game.id}`)}
                    >
                      PLAY NOW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Filters */}
        <div className="md:hidden mb-4">
          <button
            className="flex items-center justify-center bg-zinc-900 border border-zinc-800 text-gray-300 px-4 py-2 rounded-lg w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2" />
            <span>Filter Games</span>
          </button>
        </div>

        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-4 ${
            showFilters ? "block" : "hidden md:flex"
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0 w-full md:w-auto">
            {[
              { label: "All", value: "all" },
              { label: "Slot Games", value: "slot-games" },
              { label: "Casino", value: "casino-games" },
              { label: "Card Games", value: "card-games" },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-1.5 rounded-lg cursor-pointer text-xs md:text-sm font-medium ${
                  activeTab === tab.value
                    ? "bg-indigo-600 text-white"
                    : isDark
                    ? "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors duration-200`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center w-full md:w-auto">
            <span className="text-xs md:text-sm mr-2">Sort by:</span>
            <select
              className={`${
                isDark
                  ? "bg-zinc-900 text-gray-300 border-zinc-800"
                  : "bg-white text-gray-700 border-gray-300"
              } border rounded px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-auto`}
            >
              <option>Relevant</option>
              <option>Newest</option>
              <option>Popular</option>
            </select>
          </div>
        </div>

        {/* All/Filtered Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2
                className={`text-base md:text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {activeTab === "all"
                  ? "All Games"
                  : activeTab === "lottery-games"
                  ? "Lottery Games"
                  : activeTab === "casino-games"
                  ? "Casino Games"
                  : activeTab === "card-games"
                  ? "Card Casino"
                  : "Slot Games"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group"
              >
                <div
                  className={`${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-gray-200"
                  } border rounded-lg overflow-hidden shadow-lg relative`}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-28 sm:h-32 md:h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-2 text-white">
                    <h3 className="font-bold text-xs md:text-sm">
                      {game.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="bg-white cursor-pointer text-indigo-600 font-semibold py-1 px-4 md:px-6 rounded-full text-xs md:text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300"
                      onClick={() => navigate(`/games/${game.id}`)}
                    >
                      PLAY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
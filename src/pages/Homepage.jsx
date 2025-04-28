import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBitcoin,
  FaDice,
  FaFire,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { RiCoinLine } from "react-icons/ri";
import { TbCards } from "react-icons/tb";
import { useWeb3 } from "../context/Web3Context";
import spinWheel from "../assets/spin_wheel.png";

export default function Homepage() {
  const { account, connectWallet, isConnecting } = useWeb3();
  const [activeTab, setActiveTab] = useState("all");

  const hotGames = [
    {
      id: "zeus",
      name: "ZEUS",
      subtitle: "THE THUNDERER",
      image: "/game-images/zeus.webp",
      provider: "Pragmatic",
    },
    {
      id: "wild-phoenix",
      name: "WILD PHOENIX",
      subtitle: "GOLD",
      image: "/game-images/phoenix.webp",
      provider: "BGT",
    },
    {
      id: "hello-win",
      name: "HELLO WIN",
      subtitle: "",
      image: "/game-images/hello-win.webp",
      provider: "Pragmatic",
    },
    {
      id: "gates-of-olympus",
      name: "GATES OF OLYMPUS",
      subtitle: "",
      image: "/game-images/olympus.webp",
      provider: "Pragmatic",
    },
    {
      id: "starlight-christmas",
      name: "STARLIGHT CHRISTMAS",
      subtitle: "",
      image: "/game-images/christmas.webp",
      provider: "Pragmatic",
    },
    {
      id: "big-bass-bonanza",
      name: "BIG BASS BONANZA",
      subtitle: "MEGAWAYS",
      image: "/game-images/bass.webp",
      provider: "Pragmatic",
    },
  ];

  return (
    <div className="bg-black text-gray-300 min-h-screen pb-8">
      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        {/* Game Categories */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 relative overflow-hidden shadow-lg hover:border-indigo-600 transition-colors duration-300">
            <div className="z-10 relative">
              <h3 className="text-xl font-bold text-white mb-1">Casino</h3>
              <p className="text-sm text-gray-400 mb-4">
                Unveil the World of Thrilling games, slots and jackpots!
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-4 rounded transition-colors duration-200">
                Free Spin
              </button>
            </div>
            <div className="absolute -right-10 top-0 opacity-70">
              <img
                src={spinWheel}
                alt="Spin wheel"
                className="h-42 object-cover"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 relative overflow-hidden shadow-lg hover:border-indigo-600 transition-colors duration-300">
            <div className="z-10 relative">
              <h3 className="text-xl font-bold text-white mb-1">Sport</h3>
              <p className="text-sm text-gray-400 mb-4">
                Best Odds, Live Statistics, and VIP Perks!
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-4 rounded transition-colors duration-200">
                Free To Play
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-70">
              <img
                src="/api/placeholder/150/150"
                alt="Trophy"
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Game Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === "lobby"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("lobby")}
            >
              Lobby
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === "live"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("live")}
            >
              Live Casino
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === "slots"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("slots")}
            >
              Slot Games
            </button>
          </div>

          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select className="bg-zinc-900 text-gray-300 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option>Relevant</option>
              <option>Newest</option>
              <option>Popular</option>
            </select>
          </div>
        </div>

        {/* Hot Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaFire className="text-red-500 mr-2" />
              <h2 className="text-lg font-bold text-white">Hot Games</h2>
            </div>
            <div className="flex space-x-2">
              <button className="bg-zinc-900 border border-zinc-800 text-white p-1 rounded hover:bg-zinc-800 transition-colors duration-200">
                <FaChevronLeft />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-white p-1 rounded hover:bg-zinc-800 transition-colors duration-200">
                <FaChevronRight />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-white px-3 py-1 rounded text-sm hover:bg-zinc-800 transition-colors duration-200">
                See All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hotGames.map((game) => (
              <div
                key={game.id}
                className="group cursor-pointer"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg relative">
                  <img
                    src="/api/placeholder/150/200"
                    alt={game.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-2 text-white">
                    <h3 className="font-bold text-sm">{game.name}</h3>
                    {game.subtitle && (
                      <p className="text-xs text-gray-300">{game.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {game.provider}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-indigo-600 font-semibold py-1 px-6 rounded-full text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      PLAY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaTrophy className="text-yellow-400 mr-2" />
              <h2 className="text-lg font-bold text-white">Top Games</h2>
            </div>
            <div className="flex space-x-2">
              <button className="bg-zinc-900 border border-zinc-800 text-white p-1 rounded hover:bg-zinc-800 transition-colors duration-200">
                <FaChevronLeft />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-white p-1 rounded hover:bg-zinc-800 transition-colors duration-200">
                <FaChevronRight />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-white px-3 py-1 rounded text-sm hover:bg-zinc-800 transition-colors duration-200">
                See All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hotGames
              .slice(0, 6)
              .reverse()
              .map((game) => (
                <div
                  key={game.id}
                  className="group cursor-pointer"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg relative">
                    <img
                      src="/api/placeholder/150/200"
                      alt={game.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 p-2 text-white">
                      <h3 className="font-bold text-sm">{game.name}</h3>
                      {game.subtitle && (
                        <p className="text-xs text-gray-300">{game.subtitle}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {game.provider}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-indigo-600 font-semibold py-1 px-6 rounded-full text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        PLAY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Popular Games */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaDice className="text-purple-400 mr-2" />
              <h2 className="text-lg font-bold text-white">
                Games You Might Like
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hotGames.slice(2, 8).map((game) => (
              <div
                key={game.id}
                className="group cursor-pointer"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg relative">
                  <img
                    src="/api/placeholder/150/200"
                    alt={game.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-2 text-white">
                    <h3 className="font-bold text-sm">{game.name}</h3>
                    {game.subtitle && (
                      <p className="text-xs text-gray-300">{game.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {game.provider}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-indigo-600 font-semibold py-1 px-6 rounded-full text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
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

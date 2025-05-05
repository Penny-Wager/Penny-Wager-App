import React, { useState } from "react";
import {
  FaHistory,
  FaTrophy,
  FaSignOutAlt,
  FaFire,
  FaDice,
} from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { useWeb3 } from "../context/Web3Context";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { account, formattedBalance, connectWallet, disconnectWallet } =
    useWeb3();
  const [activeTab, setActiveTab] = useState("overview");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mock data for a user profile
  const userStats = {
    gamesPlayed: 128,
    wins: 78,
    losses: 50,
    totalWagered: 145.82,
    totalWon: 187.35,
    profitLoss: 41.53,
    winRate: "60.9%",
    favoriteGame: "Coin Flip",
    highestWin: 12.75,
    recentGames: [
      {
        id: 1,
        game: "Dice Roll",
        bet: 1.5,
        result: "Win",
        payout: 3.0,
        time: "Yesterday, 8:15 PM",
      },
      {
        id: 2,
        game: "Coin Flip",
        bet: 2.0,
        result: "Loss",
        payout: 0,
        time: "Yesterday, 7:45 PM",
      },
      {
        id: 3,
        game: "Lucky Number",
        bet: 0.5,
        result: "Win",
        payout: 4.5,
        time: "Yesterday, 6:30 PM",
      },
    ],
  };

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <div
        className={`${isDark ? "bg-black" : "bg-gray-50"} ${
          isDark ? "text-gray-300" : "text-gray-700"
        } min-h-screen flex items-center justify-center`}
      >
        <div className="container mx-auto px-4 py-8">
          <div
            className={`${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-gray-200"
            } border rounded-lg p-8 shadow-lg text-center max-w-lg mx-auto`}
          >
            <div className="mb-6 flex justify-center">
              <div className=" flex items-center justify-center text-white">
                <IoWalletOutline className="text-3xl" />
              </div>
            </div>
            <h1
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Connect Your Wallet
            </h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-8`}>
              Connect your wallet to view your profile, game history, and stats.
            </p>
            <button
              onClick={connectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-200"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isDark ? "bg-black" : "bg-white"} ${
        isDark ? "text-gray-300" : "text-gray-700"
      } min-h-screen pb-8`}
    >
      <div className="container mx-auto px-4 py-8">
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          My Profile
        </h1>

        {/* Player info card */}
        <div
          className={`${
            isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          } border rounded-lg p-6 shadow-lg mb-8`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {account.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Player #{account.slice(2, 8)}
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } flex items-center`}
                >
                  <IoWalletOutline className="mr-1" /> {formatAddress(account)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Balance
              </p>
              <p className="text-2xl font-bold text-indigo-400">
                {parseFloat(formattedBalance).toFixed(4)} MONAD
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`mb-6 border-b ${
            isDark ? "border-zinc-800" : "border-gray-200"
          }`}
        >
          <nav className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white rounded-t-lg"
                  : `${
                      isDark
                        ? "text-gray-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    } rounded-t-lg`
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white rounded-t-lg"
                  : `${
                      isDark
                        ? "text-gray-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    } rounded-t-lg`
              }`}
            >
              Game History
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "achievements"
                  ? "bg-indigo-600 text-white rounded-t-lg"
                  : `${
                      isDark
                        ? "text-gray-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    } rounded-t-lg`
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "settings"
                  ? "bg-indigo-600 text-white rounded-t-lg"
                  : `${
                      isDark
                        ? "text-gray-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    } rounded-t-lg`
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="mb-8">
          {activeTab === "overview" && (
            <div>
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  className={`${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-gray-200"
                  } border rounded-lg p-4 shadow-lg`}
                >
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm mb-1`}
                  >
                    Games Played
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {userStats.gamesPlayed}
                  </p>
                </div>
                <div
                  className={`${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-gray-200"
                  } border rounded-lg p-4 shadow-lg`}
                >
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm mb-1`}
                  >
                    Win Rate
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {userStats.winRate}
                  </p>
                </div>
                <div
                  className={`${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-gray-200"
                  } border rounded-lg p-4 shadow-lg`}
                >
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm mb-1`}
                  >
                    Total Wagered
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {userStats.totalWagered} MONAD
                  </p>
                </div>
                <div
                  className={`${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-gray-200"
                  } border rounded-lg p-4 shadow-lg`}
                >
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm mb-1`}
                  >
                    Profit/Loss
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      userStats.profitLoss >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {userStats.profitLoss >= 0 ? "+" : ""}
                    {userStats.profitLoss} MONAD
                  </p>
                </div>
              </div>

              {/* Recent activity */}
              <div
                className={`${
                  isDark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-gray-200"
                } border rounded-lg p-6 shadow-lg`}
              >
                <div className="flex items-center mb-4">
                  <FaHistory className="text-indigo-400 mr-2" />
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Recent Activity
                  </h3>
                </div>
                <div
                  className={`divide-y ${
                    isDark ? "divide-zinc-800" : "divide-gray-200"
                  }`}
                >
                  {userStats.recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <p
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {game.game}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {game.time}
                        </p>
                      </div>
                      <div
                        className={`font-bold ${
                          game.result === "Win"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {game.result === "Win"
                          ? `+${game.payout}`
                          : `-${game.bet}`}{" "}
                        MONAD
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`mt-6 pt-4 border-t ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  }`}
                >
                  <button
                    className={`w-full ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }  py-2 rounded-lg transition-colors duration-200`}
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div
              className={`${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-gray-200"
              } border rounded-lg p-6 shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <FaHistory className="text-indigo-400 mr-2" />
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Game History
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`text-left ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } border-b ${
                        isDark ? "border-zinc-800" : "border-gray-200"
                      }`}
                    >
                      <th className="pb-4 pr-6">Game</th>
                      <th className="pb-4 pr-6">Bet</th>
                      <th className="pb-4 pr-6">Result</th>
                      <th className="pb-4 pr-6">Payout</th>
                      <th className="pb-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...userStats.recentGames, ...userStats.recentGames].map(
                      (game, index) => (
                        <tr
                          key={`${game.id}-${index}`}
                          className={`border-b ${
                            isDark ? "border-zinc-800" : "border-gray-200"
                          }`}
                        >
                          <td
                            className={`py-4 pr-6 ${
                              isDark ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {game.game}
                          </td>
                          <td className="py-4 pr-6">{game.bet} MONAD</td>
                          <td
                            className={`py-4 pr-6 ${
                              game.result === "Win"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {game.result}
                          </td>
                          <td
                            className={`py-4 pr-6 ${
                              game.result === "Win"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {game.result === "Win" ? `+${game.payout}` : "-0"}{" "}
                            MONAD
                          </td>
                          <td
                            className={`py-4 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {game.time}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  className={`${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  } ${
                    isDark ? "text-white" : "text-gray-700"
                  } py-2 px-4 rounded-lg transition-colors duration-200`}
                >
                  Previous
                </button>
                <div
                  className={`flex items-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>Page 1 of 8</span>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div
              className={`${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-gray-200"
              } border rounded-lg p-6 shadow-lg`}
            >
              <div className="flex items-center mb-6">
                <FaTrophy className="text-indigo-400 mr-2" />
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Achievements
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  className={`border border-indigo-600 ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-900 flex items-center justify-center mr-4">
                    <FaTrophy className="text-indigo-400" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      First Win
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Win your first game
                    </p>
                  </div>
                </div>

                <div
                  className={`border ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  } ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 opacity-50">
                    <FaTrophy className="text-gray-400" />
                  </div>
                  <div className="opacity-70">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      High Roller
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Place a bet of 10+ MONAD
                    </p>
                  </div>
                </div>

                <div
                  className={`border ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  } ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 opacity-50">
                    <FaTrophy className="text-gray-400" />
                  </div>
                  <div className="opacity-70">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Lucky Streak
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Win 5 games in a row
                    </p>
                  </div>
                </div>

                <div
                  className={`border ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  } ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 opacity-50">
                    <FaDice className="text-gray-400" />
                  </div>
                  <div className="opacity-70">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Jackpot
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Win 50+ MONAD in a single game
                    </p>
                  </div>
                </div>

                <div
                  className={`border ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  } ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 opacity-50">
                    <FaFire className="text-gray-400" />
                  </div>
                  <div className="opacity-70">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      On Fire
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Play 10 games in one day
                    </p>
                  </div>
                </div>

                <div
                  className={`border ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  } ${
                    isDark ? "bg-zinc-900" : "bg-gray-50"
                  } bg-opacity-50 rounded-lg p-4 flex items-center`}
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 opacity-50">
                    <IoWalletOutline className="text-gray-400" />
                  </div>
                  <div className="opacity-70">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Crypto Whale
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Hold 1000+ MONAD in your wallet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div
              className={`${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-gray-200"
              } border rounded-lg p-6 shadow-lg`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Account Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <h4
                    className={`font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Connected Wallet
                  </h4>
                  <div
                    className={`flex items-center justify-between p-4 border ${
                      isDark
                        ? "border-zinc-800 bg-zinc-800"
                        : "border-gray-200 bg-gray-100"
                    } bg-opacity-50 rounded-lg`}
                  >
                    <div className="flex items-center">
                      <IoWalletOutline className="text-indigo-400 mr-2" />
                      <span
                        className={`${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        {formatAddress(account)}
                      </span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-1" /> Disconnect
                    </button>
                  </div>
                </div>

                <div>
                  <h4
                    className={`font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Preferences
                  </h4>
                  <div
                    className={`p-4 border ${
                      isDark
                        ? "border-zinc-800 bg-zinc-800"
                        : "border-gray-200 bg-gray-100"
                    } bg-opacity-50 rounded-lg`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        Sound Effects
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        Notifications
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        Dark Mode
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={isDark}
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

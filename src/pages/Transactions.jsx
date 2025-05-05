import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaExchangeAlt,
  FaFilter,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaGamepad,
  FaCoins,
} from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";
import { useTheme } from "../context/ThemeContext";
import AddressAvatar from "../components/AddressAvatar";

export default function Transactions() {
  const { account, formattedBalance } = useWeb3();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Mock transaction data
  useEffect(() => {
    // Simulate API fetch with timeout
    const fetchTransactions = () => {
      setIsLoading(true);

      // Mock data generation
      setTimeout(() => {
        const mockTransactions = generateMockTransactions(50);
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setIsLoading(false);
      }, 1000);
    };

    if (account) {
      fetchTransactions();
    }
  }, [account]);

  // Generate mock transaction data
  const generateMockTransactions = (count) => {
    const types = ["bet", "win", "deposit", "withdrawal"];
    const games = [
      "Dice Roll",
      "Coin Flip",
      "Lucky Number",
      "Roulette",
      "Blackjack",
    ];
    const now = new Date();

    return Array.from({ length: count }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const isGame = type === "bet" || type === "win";
      const amount = parseFloat((Math.random() * 10).toFixed(4));
      const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000);

      return {
        id: `tx-${i}`,
        type,
        amount,
        timestamp: date.getTime(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: Math.random() > 0.1 ? "confirmed" : "pending",
        game: isGame ? games[Math.floor(Math.random() * games.length)] : null,
        hash: `0x${Array.from(
          { length: 64 },
          () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join("")}`,
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  // Filter and search transactions
  useEffect(() => {
    let results = [...transactions];

    // Apply type filter
    if (filterType !== "all") {
      results = results.filter((tx) => tx.type === filterType);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(query) ||
          (tx.game && tx.game.toLowerCase().includes(query)) ||
          tx.type.toLowerCase().includes(query)
      );
    }

    // Apply sort
    results = results.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    setFilteredTransactions(results);
    setCurrentPage(1);
  }, [filterType, searchQuery, transactions, sortOrder]);

  // Get current page transactions
  const indexOfLastTx = currentPage * transactionsPerPage;
  const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTx,
    indexOfLastTx
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Transaction type badge
  const TransactionBadge = ({ type }) => {
    let icon;
    let color;
    let bg;

    switch (type) {
      case "bet":
        icon = <FaGamepad className="mr-1" />;
        color = "text-yellow-400";
        bg = "bg-yellow-900";
        break;
      case "win":
        icon = <FaCoins className="mr-1" />;
        color = "text-green-400";
        bg = "bg-green-900";
        break;
      case "deposit":
        icon = <FaArrowDown className="mr-1" />;
        color = "text-blue-400";
        bg = "bg-blue-900";
        break;
      case "withdrawal":
        icon = <FaArrowUp className="mr-1" />;
        color = "text-red-400";
        bg = "bg-red-900";
        break;
      default:
        icon = <FaExchangeAlt className="mr-1" />;
        color = "text-gray-400";
        bg = "bg-gray-900";
    }

    return (
      <span
        className={`flex items-center px-2 py-1 rounded-md ${color} ${bg} text-xs font-medium`}
      >
        {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <div
        className={`${isDark ? "bg-black" : "bg-white"} ${
          isDark ? "text-gray-300" : "text-gray-700"
        } min-h-screen flex items-center justify-center`}
      >
        <div className="container mx-auto px-4 py-8">
          <div
            className={`${isDark ? "bg-zinc-900" : "bg-gray-50"} ${
              isDark ? "border-zinc-800" : "border-gray-200"
            } border rounded-lg p-8 shadow-lg text-center max-w-lg mx-auto`}
          >
            <div className="mb-6 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center text-white">
                <FaWallet className="text-3xl" />
              </div>
            </div>
            <h1
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Connect Your Wallet
            </h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-8`}>
              Connect your wallet to view your transaction history.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-200">
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
          My Transactions
        </h1>

        {/* Account overview */}
        <div
          className={`${isDark ? "bg-zinc-900" : "bg-gray-50"} ${
            isDark ? "border-zinc-800" : "border-gray-200"
          } border rounded-lg p-6 shadow-lg mb-8`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex gap-5 items-center mb-4 md:mb-0">
              <AddressAvatar
                address={account}
                size="md"
              />
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Account
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } flex items-center`}
                >
                  <FaWallet className="mr-1" /> {formatAddress(account)}
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

        {/* Filters and search */}
        <div
          className={`${isDark ? "bg-zinc-900" : "bg-gray-50"} ${
            isDark ? "border-zinc-800" : "border-gray-200"
          } border rounded-lg p-6 shadow-lg mb-8`}
        >
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:items-center lg:justify-between">
            <div className="flex items-center">
              <FaFilter className="text-indigo-400 mr-2" />
              <span
                className={`${isDark ? "text-white" : "text-gray-800"} mr-3`}
              >
                Filter:
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg ${
                    filterType === "all"
                      ? "bg-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("bet")}
                  className={`px-3 py-1 rounded-lg ${
                    filterType === "bet"
                      ? "bg-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Bets
                </button>
                <button
                  onClick={() => setFilterType("win")}
                  className={`px-3 py-1 rounded-lg ${
                    filterType === "win"
                      ? "bg-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Wins
                </button>
                <button
                  onClick={() => setFilterType("deposit")}
                  className={`px-3 py-1 rounded-lg ${
                    filterType === "deposit"
                      ? "bg-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Deposits
                </button>
                <button
                  onClick={() => setFilterType("withdrawal")}
                  className={`px-3 py-1 rounded-lg ${
                    filterType === "withdrawal"
                      ? "bg-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Withdrawals
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${
                    isDark
                      ? "bg-zinc-800 border-zinc-700"
                      : "bg-white border-gray-300"
                  } border rounded-lg px-4 py-2 pl-10 w-full ${
                    isDark ? "text-white" : "text-gray-800"
                  } focus:outline-none focus:border-indigo-500`}
                />
                <FaSearch
                  className={`absolute left-3 top-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className={`flex items-center justify-center ${
                  isDark
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${
                  isDark ? "text-white" : "text-gray-800"
                } px-4 py-2 rounded-lg`}
              >
                {sortOrder === "newest" ? (
                  <>
                    <FaArrowDown className="mr-2" /> Newest First
                  </>
                ) : (
                  <>
                    <FaArrowUp className="mr-2" /> Oldest First
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div
          className={`${isDark ? "bg-zinc-900" : "bg-gray-50"} ${
            isDark ? "border-zinc-800" : "border-gray-200"
          } border rounded-lg p-6 shadow-lg mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              } flex items-center`}
            >
              <FaExchangeAlt className="text-indigo-400 mr-2" />
              Transaction History
            </h3>
            <span
              className={`${
                isDark ? "text-gray-400" : "text-gray-500"
              } text-sm`}
            >
              {filteredTransactions.length} transactions found
            </span>
          </div>

          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No transactions found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`text-left ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } ${
                        isDark ? "border-zinc-800" : "border-gray-200"
                      } border-b`}
                    >
                      <th className="pb-4 pr-6">Type</th>
                      <th className="pb-4 pr-6">Amount</th>
                      <th className="pb-4 pr-6 hidden md:table-cell">Game</th>
                      <th className="pb-4 pr-6">Date & Time</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className={`${
                          isDark ? "border-zinc-800" : "border-gray-200"
                        } border-b ${
                          isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                        } cursor-pointer`}
                      >
                        <td className="py-4 pr-6">
                          <TransactionBadge type={tx.type} />
                        </td>
                        <td className="py-4 pr-6">
                          <span
                            className={`font-medium ${
                              tx.type === "win" || tx.type === "deposit"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {tx.type === "win" || tx.type === "deposit"
                              ? "+"
                              : "-"}
                            {tx.amount.toFixed(4)} MONAD
                          </span>
                        </td>
                        <td className="py-4 pr-6 hidden md:table-cell">
                          {tx.game || "-"}
                        </td>
                        <td className="py-4 pr-6">
                          <div
                            className={`${
                              isDark ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {tx.date}
                          </div>
                          <div
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } text-sm`}
                          >
                            {tx.time}
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === "confirmed"
                                ? "bg-green-900 text-green-400"
                                : "bg-yellow-900 text-yellow-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`${isDark ? "bg-zinc-800" : "bg-gray-200"} ${
                    isDark ? "text-white" : "text-gray-800"
                  } py-2 px-4 rounded-lg transition-colors duration-200 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : isDark
                      ? "hover:bg-zinc-700"
                      : "hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>

                <div
                  className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-indigo-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

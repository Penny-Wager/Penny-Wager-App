import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  FaWallet,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaCrown,
  FaSearch,
  FaNetworkWired,
} from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";
import { motion, AnimatePresence } from "framer-motion";
import { AccountDropdown } from "./AccountDropdown";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    account,
    connectWallet,
    disconnectWallet,
    isConnecting,
    isOnMonadChain,
    switchToMonadChain,
    formattedBalance,
  } = useWeb3();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Animation variants
  const animations = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    },
    sidebar: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    },
  };

  // Reusable navigation link component
  const NavItem = ({ to, icon, children }) => (
    <motion.li variants={animations.item}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-zinc-900 hover:text-white"
          }`
        }
        end={to === "/"}
      >
        {typeof icon === "string" ? (
          <span className="mr-3 text-lg">{icon}</span>
        ) : (
          React.cloneElement(icon, { className: "mr-3 text-lg" })
        )}
        <span>{children}</span>
      </NavLink>
    </motion.li>
  );

  // Menu sections data
  const menuSections = [
    {
      title: "MENU",
      items: [
        { icon: <FaHome />, to: "/", label: "Home" },
        { icon: "⭐", to: "/favorites", label: "Favorites" },
        { icon: "🕒", to: "/recently-played", label: "Recently Played" },
      ],
    },
    {
      title: "GAMES",
      items: [
        { icon: "🎮", to: "/all-games", label: "All Games" },
        { icon: "🎰", to: "/slot-games", label: "Slot Games" },
        { icon: "🎟️", to: "/lottery", label: "Lottery" },
      ],
    },
  ];

  // Network status component
  const NetworkStatus = ({ isMobile = false }) => (
    <>
      {isOnMonadChain() ? (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
          <span className={`${isMobile ? "" : "text-sm"} text-green-400`}>
            {isMobile ? "Monad Chain" : "Monad Testnet"}
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
          <motion.button
            onClick={switchToMonadChain}
            className={`${
              isMobile ? "" : "text-sm"
            } text-indigo-400 hover:text-indigo-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Switch to Monad {isMobile && "Chain"}
          </motion.button>
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen flex bg-black text-gray-200 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-black border-r border-zinc-800 hidden lg:block flex-shrink-0 h-screen overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={animations.sidebar}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6">
            <Link
              to="/"
              className="flex items-center group"
            >
              <motion.div
                className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-500 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCrown className="text-yellow-300 text-xl" />
              </motion.div>
              <span className="font-bold text-xl text-white">Penny Wager</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            {menuSections.map((section, idx) => (
              <div
                key={idx}
                className="mb-6"
              >
                <div className="text-gray-500 text-sm font-medium mb-4 px-2">
                  {section.title}
                </div>
                <motion.ul
                  className="space-y-2"
                  variants={animations.container}
                  initial="hidden"
                  animate="visible"
                >
                  {section.items.map((item, itemIdx) => (
                    <NavItem
                      key={itemIdx}
                      to={item.to}
                      icon={item.icon}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </motion.ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <div className="text-center text-xs text-gray-500">
              <p>© 2025 Penny Wager</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content flex column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-black border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0">
          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-zinc-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </motion.button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md ml-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-zinc-900 w-full border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Search for games..."
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Network Status Indicator */}
            {account && (
              <div className="hidden md:flex items-center bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 cursor-pointer">
                <FaNetworkWired className="text-sm mr-2" />
                <NetworkStatus />
              </div>
            )}

            {/* Balance */}
            {account && (
              <motion.div
                className="hidden sm:flex bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 cursor-pointer"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center">
                  <span className="text-white font-medium">
                    {formattedBalance || "0.0"} MON
                  </span>
                </div>
              </motion.div>
            )}

            {/* Connect/Account Button */}
            {!account ? (
              <motion.button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWallet className="mr-2" />
                {isConnecting ? "Connecting..." : "Connect"}
              </motion.button>
            ) : (
              <AccountDropdown
                formatAddress={formatAddress}
              />
            )}
          </div>
        </header>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-black border-b border-zinc-800 flex-shrink-0"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="px-2 pt-2 pb-3 space-y-1"
                variants={animations.container}
                initial="hidden"
                animate="visible"
              >
                {/* Mobile Navigation */}
                {["Home", "Favorites", "Slot Games", "Table Games"].map(
                  (item, idx) => (
                    <motion.div
                      key={idx}
                      variants={animations.item}
                    >
                      <NavLink
                        to={
                          item === "Home"
                            ? "/"
                            : `/${item.toLowerCase().replace(" ", "-")}`
                        }
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md transition-colors duration-200 ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "text-gray-300 hover:bg-zinc-900"
                          }`
                        }
                        end={item === "Home"}
                      >
                        {item}
                      </NavLink>
                    </motion.div>
                  )
                )}

                {/* Mobile Chain Status */}
                {account && !isOnMonadChain() && (
                  <motion.div variants={animations.item}>
                    <button
                      onClick={switchToMonadChain}
                      className="w-full text-left block px-3 py-2 rounded-md text-indigo-400 hover:bg-zinc-900 flex items-center transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Switch to Monad Chain
                    </button>
                  </motion.div>
                )}

                {/* Mobile Balance Display */}
                {account && (
                  <motion.div
                    variants={animations.item}
                    className="block px-3 py-2 rounded-md text-gray-300"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Balance:</span>
                      <span>{formattedBalance || "0.0"} MON</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main outlet for page content */}
        <motion.main
          className="flex-1 overflow-y-auto bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

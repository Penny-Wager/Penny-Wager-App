import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaHistory,
  FaStar,
  FaCrown,
  FaSearch,
  FaNetworkWired,
  FaDice,
} from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { GiCardRandom } from "react-icons/gi";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaTicketAlt } from "react-icons/fa";
import { useWeb3 } from "../context/Web3Context";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { AccountDropdown } from "./AccountDropdown";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const {
    account,
    connectWallet,
    disconnectWallet,
    isConnecting,
    isOnMonadChain,
    switchToMonadChain,
    formattedBalance,
    formatAddress,
  } = useWeb3();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isDark = theme === "dark";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    mobileSidebar: {
      hidden: { x: "-100%", opacity: 0.8 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" },
      },
      exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.2, ease: "easeIn" },
      },
    },
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 0.6, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const NavItem = ({ to, icon, children }) => {
    const location = useLocation();

    const [path, query] = to.split("?");

    const isActive = (() => {
      if (to === "/" && location.pathname === "/") return true;

      if (query) {
        const currentQuery = new URLSearchParams(location.search);
        const itemQuery = new URLSearchParams(`?${query}`);

        const currentCategory = currentQuery.get("category");
        const itemCategory = itemQuery.get("category");

        return location.pathname === path && currentCategory === itemCategory;
      }

      if (path === "/games" && location.pathname === "/games") {
        return !location.search || location.search === "";
      }

      return location.pathname === path;
    })();

    return (
      <motion.li variants={animations.item}>
        <NavLink
          to={to}
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-indigo-600 text-white"
              : `${
                  isDark
                    ? "text-gray-300 hover:bg-zinc-900"
                    : "text-gray-700 hover:bg-gray-100"
                } hover:text-indigo-600`
          }`}
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
  };

  // Menu sections data
  const menuSections = [
    {
      title: "MENU",
      items: [
        { icon: <FaHome />, to: "/", label: "Home" },
        { icon: <FaStar />, to: "/favorites", label: "Favorites" },
        {
          icon: <FaHistory />,
          to: "/recently-played",
          label: "Recently Played",
        },
      ],
    },
    {
      title: "GAMES",
      items: [
        { icon: <IoGameControllerOutline />, to: "/games", label: "All Games" },
        {
          icon: <FaDice />,
          to: "/games?category=casino-games",
          label: "Casino Games",
        },
        {
          icon: <FaTicketAlt />,
          to: "/games?category=lottery-games",
          label: "Lottery Games",
        },
        {
          icon: <GiCardRandom />,
          to: "/games?category=card-games",
          label: "Card Games",
        },
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

  // Sidebar content component for reuse in both desktop and mobile
  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link
          to="/"
          className="flex items-center group"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <motion.div
            className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-500 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCrown className="text-yellow-300 text-xl" />
          </motion.div>
          <span
            className={`font-bold text-xl ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Penny Wager
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {menuSections.map((section, idx) => (
          <div
            key={idx}
            className="mb-6"
          >
            <div
              className={`${
                isDark ? "text-gray-500" : "text-gray-600"
              } text-sm font-medium mb-4 px-2`}
            >
              {section.title}
            </div>
            <motion.ul
              className="space-y-2"
              variants={animations.container}
              initial={hasAnimated ? "visible" : "hidden"}
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

      {/* Mobile Extra Info */}
      {isMobile && account && (
        <div
          className={`px-4 py-4 border-t ${
            isDark ? "border-zinc-800" : "border-gray-200"
          }`}
        >
          {/* Network Status */}
          <div className="mb-4 flex items-center">
            <FaNetworkWired className="mr-2" />
            <NetworkStatus isMobile={true} />
          </div>

          {/* Balance */}
          <div className="mb-4">
            <div
              className={`${
                isDark ? "text-gray-500" : "text-gray-600"
              } text-sm mb-1`}
            >
              Balance
            </div>
            <div
              className={`${
                isDark ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              {formattedBalance || "0.0"} MON
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className={`p-4 border-t ${
          isDark ? "border-zinc-800" : "border-gray-200"
        }`}
      >
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 Penny Wager</p>
        </div>
      </div>
    </div>
  );

  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-800";
  const borderColor = isDark ? "border-zinc-800" : "border-gray-200";

  return (
    <div className={`h-screen flex ${bgColor} ${textColor} overflow-hidden`}>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`w-64 ${bgColor} border-r ${borderColor} hidden lg:block flex-shrink-0 h-screen overflow-y-auto`}
        initial="hidden"
        animate="visible"
        variants={animations.sidebar}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-40 lg:hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animations.overlay}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className={`fixed z-50 w-64 ${bgColor} border-r ${borderColor} h-screen overflow-y-auto lg:hidden`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animations.mobileSidebar}
            >
              <div className="flex justify-end p-4 lg:hidden">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 ${
                    isDark
                      ? "text-gray-300 hover:bg-zinc-900"
                      : "text-gray-600 hover:bg-gray-100"
                  } rounded`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content flex column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header
          className={`h-16 ${bgColor} border-b ${borderColor} flex items-center justify-between lg:justify-end px-4 flex-shrink-0`}
        >
          {/* Mobile menu button */}
          <motion.button
            className={`lg:hidden p-2 rounded-md ${
              isDark
                ? "text-gray-300 hover:bg-zinc-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaBars className="h-6 w-6" />
          </motion.button>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-md cursor-pointer ${
                isDark
                  ? "bg-zinc-700 text-yellow-300"
                  : "bg-gray-100 text-gray-700"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
            </motion.button>

            {/* Network Status Indicator */}
            {account && (
              <div
                className={`hidden md:flex items-center ${
                  isDark ? "bg-zinc-900" : "bg-gray-100"
                } px-3 py-1.5 rounded-md border ${borderColor} cursor-pointer`}
              >
                <FaNetworkWired className="text-sm mr-2" />
                <NetworkStatus />
              </div>
            )}

            {/* Balance */}
            {account && (
              <motion.div
                className={`hidden sm:flex ${
                  isDark ? "bg-zinc-900" : "bg-gray-100"
                } px-3 py-1.5 rounded-md border ${borderColor} cursor-pointer`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center">
                  <span
                    className={`${
                      isDark ? "text-white" : "text-gray-800"
                    } font-medium`}
                  >
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
                <IoWalletOutline className="mr-2" />
                {isConnecting ? "Connecting..." : "Connect"}
              </motion.button>
            ) : (
              <AccountDropdown formatAddress={formatAddress} />
            )}
          </div>
        </header>

        {/* Main outlet for page content */}
        <motion.main
          className={`flex-1 overflow-y-auto ${bgColor}`}
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

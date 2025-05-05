import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "../context/Web3Context";
import { useTheme } from "../context/ThemeContext";

export const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    account,
    isOnMonadChain,
    disconnectWallet,
    switchToMonadChain,
    formatAddress,
  } = useWeb3();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <motion.button
        className={`flex items-center ${
          isDark
            ? "bg-zinc-900 text-white border-zinc-800"
            : "bg-gray-100 text-gray-800 border-gray-200"
        } px-3 py-1.5 rounded-md border cursor-pointer`}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaUser className="mr-2" />
        {formatAddress(account)}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute right-0 mt-2 w-48 ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-gray-300"
            } rounded-md shadow-lg py-1 z-50 border`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {["Profile", "Transactions"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className={`block px-4 py-2 text-sm ${
                  isDark
                    ? "text-gray-300 hover:bg-zinc-800"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 cursor-pointer`}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            {!isOnMonadChain() && (
              <button
                onClick={() => {
                  switchToMonadChain();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  isDark
                    ? "text-indigo-400 hover:bg-zinc-800"
                    : "text-indigo-600 hover:bg-gray-100"
                } transition-colors duration-200 cursor-pointer`}
              >
                Switch to Monad Chain
              </button>
            )}
            <button
              onClick={() => {
                disconnectWallet();
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                isDark
                  ? "text-red-400 hover:bg-zinc-800"
                  : "text-red-600 hover:bg-gray-100"
              } transition-colors duration-200 cursor-pointer`}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

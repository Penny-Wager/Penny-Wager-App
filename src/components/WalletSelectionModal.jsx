import React from "react";
import { useConnect } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaWallet } from "react-icons/fa";
import MetamaskIcon from "../assets/metamask.svg";
import CoinbaseIcon from "../assets/coinbase.svg";
import PhantomIcon from "../assets/phantom.svg";
import BackpackIcon from "../assets/backpack.png";

function WalletSelectionModal({ isOpen, onClose }) {
  const { connectors, connect, isPending, pendingConnector, error } =
    useConnect();

  // Helper function to get icon based on connector name
  const getConnectorIcon = (connector) => {
    const name = connector.name.toLowerCase();

    if (name.includes("metamask")) {
      return MetamaskIcon;
    } else if (name.includes("coinbase")) {
      return CoinbaseIcon;
    } else if (name.includes("phantom")) {
      return PhantomIcon;
    } else if (name.includes("backpack")) {
      return BackpackIcon;
    } else {
      return null; // Will render FaWallet icon as fallback
    }
  };

  // Modal animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md mx-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
            variants={modalVariants}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Connect Wallet
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content - Fixed height and scrollable */}
            <div className="p-6 h-[60vh] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm">
                  {error.message || "Failed to connect. Please try again."}
                </div>
              )}

              <div className="space-y-3">
                {connectors.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">😢</div>
                    <p className="text-lg text-gray-300 mb-2">
                      No wallets detected
                    </p>
                    <p className="text-sm text-gray-500">
                      Please install MetaMask, Phantom, or another
                      Monad-compatible wallet
                    </p>
                  </div>
                ) : (
                  connectors.map((connector) => {
                    const icon = getConnectorIcon(connector);

                    return (
                      <motion.button
                        key={connector.uid}
                        onClick={() => {
                          connect({ connector });
                          onClose();
                        }}
                        disabled={
                          isPending && pendingConnector?.uid === connector.uid
                        }
                        className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded-md mr-3 text-xl">
                            {icon ? (
                              <img
                                src={icon}
                                alt={connector.name}
                                className="w-6 h-6"
                              />
                            ) : (
                              <FaWallet className="text-white" />
                            )}
                          </div>
                          <span className="font-medium text-white">
                            {connector.name}
                          </span>
                        </div>
                        {isPending &&
                          pendingConnector?.uid === connector.uid && (
                            <div className="spinner">
                              <div className="w-5 h-5 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900">
              <div className="text-center text-sm text-gray-500">
                <p>New to Monad wallets?</p>
                <div className="mt-2 flex justify-center space-x-4">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Install MetaMask
                  </a>
                  <a
                    href="https://phantom.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Install Phantom
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WalletSelectionModal;

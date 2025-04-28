import React, { createContext, useContext } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
  useConfig,
} from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

// Create a context for our Web3 functionality
const Web3Context = createContext(null);

// Monad chain configuration
const MONAD_CHAIN_ID = monadTestnet.id;

// Custom hook for using the Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Main provider component
export const Web3Provider = ({ children }) => {
  const config = useConfig();

  // Account state
  const { address, isConnected } = useAccount();

  // Connection state
  const {
    connect,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();

  // Disconnect functionality
  const { disconnect } = useDisconnect();

  // Current chain information
  const chainId = useChainId();

  // Chain switching functionality
  const { switchChain } = useSwitchChain();

  // Balance information
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    watch: true,
  });

  // Format balance to display
  const formattedBalance =
    balanceData && !isBalanceLoading
      ? parseFloat(balanceData.formatted).toFixed(5)
      : "0.00000";

  // Connect wallet function using WalletConnect
  const connectWallet = async () => {
    try {
      // Use WalletConnect connector which will show multiple wallet options
      const connector = walletConnect(config);
      await connect({ connector });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Function to check if connected to Monad chain
  const isOnMonadChain = () => {
    return chainId === MONAD_CHAIN_ID;
  };

  // Function to switch to Monad chain
  const switchToMonadChain = async () => {
    if (!isOnMonadChain()) {
      try {
        await switchChain({ chainId: MONAD_CHAIN_ID });
      } catch (error) {
        console.error("Failed to switch chain:", error);

        // Handle case where chain needs to be added
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
                  chainName: "Monad Testnet",
                  nativeCurrency: {
                    name: "MON",
                    symbol: "MON",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.monad.xyz/testnet"],
                  blockExplorerUrls: ["https://explorer.monad.xyz/testnet"],
                },
              ],
            });

            // Try switching again after adding
            await switchChain({ chainId: MONAD_CHAIN_ID });
          } catch (addError) {
            console.error("Failed to add chain:", addError);
          }
        }
      }
    }
  };

  // Format address helper
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Values to provide through context
  const value = {
    account: address,
    isConnected,
    isConnecting,
    connectError,
    formattedBalance,
    connectWallet,
    disconnectWallet: disconnect,
    formatAddress,
    isOnMonadChain,
    switchToMonadChain,
    MONAD_CHAIN_ID,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Main provider component with required configuration
export const Web3ProviderWrapper = ({ children }) => {
  return <Web3Provider>{children}</Web3Provider>;
};

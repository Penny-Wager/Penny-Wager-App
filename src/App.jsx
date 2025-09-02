import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import wagmiConfig from "./config/wagmiConfig ";
import { Web3Provider } from "./context/Web3Context";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Transactions from "./pages/Transactions";
import Favorites from "./pages/Favorites";
import Games from "./pages/Games";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import AviatorGame from "./game/AviatorGame";
import CardPickGame from "./game/CardPickGame";
import CoinFlipGame from "./game/CoinFlipGame";

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Web3Provider>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={<Layout />}
                >
                  <Route
                    index
                    element={<Homepage />}
                  />
                  <Route
                    path="games"
                    element={<Games />}
                  />
                  <Route
                    path="favorites"
                    element={<Favorites />}
                  />
                  <Route
                    path="recently-played"
                    element={<RecentlyPlayed />}
                  />
                  <Route
                    path="games/coin-flip"
                    element={<CoinFlipGame />}
                  />
                  <Route
                    path="games/dice-roll"
                    element={<div>Dice Roll Game</div>}
                  />
                  <Route
                    path="games/lucky-number"
                    element={<div>Lucky Number Game</div>}
                  />
                  <Route
                    path="games/card-pick"
                    element={<CardPickGame/>}
                  />
                  <Route
                    path="games/aviator"
                    element={<AviatorGame/>}
                  />
                  <Route
                    path="profile"
                    element={<Profile />}
                  />
                  <Route
                    path="transactions"
                    element={<Transactions />}
                  />
                  <Route
                    path="*"
                    element={<NotFound />}
                  />
                </Route>
              </Routes>
            </Router>
          </Web3Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

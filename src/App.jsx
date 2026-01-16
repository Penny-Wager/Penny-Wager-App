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
import { GAMES } from "./config/games";

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

                  {GAMES.map((game) => (
                    <Route
                      key={game.id}
                      path={`games/${game.path}`}
                      element={game.element}
                    />
                  ))}

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

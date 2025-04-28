import { http, createConfig } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const projectId = process.env.VITE_WALLETCONNECT_ID;

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: projectId,
      metadata: {
        name: "Penny Wager",
        url: "https://your-website.com",
        icons: ["https://your-website.com/icon.png"],
      },
    }),
  ],
});

export default wagmiConfig;

import { http, createConfig } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const projectId = process.env.VITE_WALLETCONNECT_ID;
const projectUrl = process.env.VITE_WALLETCONNECT_PROJECTURL;
const projectIcon = process.env.VITE_WALLETCONNECT_PROJECTICON;


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
        url: projectUrl,
        icons: projectIcon,
      },
    }),
  ],
});

export default wagmiConfig;

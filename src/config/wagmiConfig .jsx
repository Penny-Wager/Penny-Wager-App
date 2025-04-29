import { http, createConfig } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { injected, coinbaseWallet, metaMask } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [metaMask(), injected()],
});

export default wagmiConfig;

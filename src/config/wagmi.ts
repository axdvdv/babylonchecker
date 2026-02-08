import { createConfig, http, fallback } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: fallback([
      http("https://eth.public-rpc.com"),
      http("https://rpc.ankr.com/eth"),
      http("https://ethereum-rpc.publicnode.com"),
      http("https://1rpc.io/eth"),
    ]),
  },
  ssr: true,
});

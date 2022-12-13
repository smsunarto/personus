import { chain, createClient, configureChains, hardhat } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(
  [chain.hardhat],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Persona",
  chains,
});
export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

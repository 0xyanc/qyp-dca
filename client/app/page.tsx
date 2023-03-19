"use client";

import { Header, Create, Footer, Position, Tab } from "./components";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { arbitrum, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useState } from "react";

const { chains, provider } = configureChains([arbitrum], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "ODCA",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const Home = () => {
  const [create, setCreate] = useState(true);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "",
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        })}
        chains={chains}
      >
        <main className="h-screen w-screen flex flex-col my-auto justify-center bg-slate-800 text-white">
          <Header />
          <Tab create={create} setCreate={setCreate} />
          {create && <Create />}
          {!create && <Position />}
          <Footer />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Home;

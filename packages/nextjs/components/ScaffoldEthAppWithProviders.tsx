"use client";

import { useEffect, useState } from "react";
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
// import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
// import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DynamicContextProvider 
    settings={{ 
      environmentId: 'c18a6f71-7c8f-4c03-bb76-292844106dec',
      walletConnectors: [ EthereumWalletConnectors, ZeroDevSmartWalletConnectors ],
    }}> 
    {/* <DynamicWidget />  */}
    <ProgressBar />
    <DynamicWagmiConnector>
    <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
      >
        <ScaffoldEthApp>{children}</ScaffoldEthApp>
      </RainbowKitProvider>
    </DynamicWagmiConnector>
  </DynamicContextProvider> 
);
  //   <WagmiConfig config={wagmiConfig}>
  //     <ProgressBar />
  //     <RainbowKitProvider
  //       chains={appChains.chains}
  //       avatar={BlockieAvatar}
  //       theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
  //     >
  //       <ScaffoldEthApp>{children}</ScaffoldEthApp>
  //     </RainbowKitProvider>
  //   </WagmiConfig>
  // );
};

'use client'

import { Header, Create, Footer, Position } from './components'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useState } from 'react';

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'ODCA',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


const Home = () => {
  const [create, setCreate] = useState(false)

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        chains={chains}>
        <main className='h-screen w-screen flex justify-center bg-slate-800'>
          <Header create={create} setCreate={setCreate} />

          {create &&
            <Create />
          }
          {!create &&
            <Position />
          }
          <Footer />
        </main>
      </RainbowKitProvider >
    </WagmiConfig >
  )
}

export default Home
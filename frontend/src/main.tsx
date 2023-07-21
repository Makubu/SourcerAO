import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

import App from './App.tsx';
import Fonts from './theme.font.tsx';
import theme from './theme.ts';

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [sepolia], // mainnet in prod
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Fonts />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiConfig config={config}>
          <App />
        </WagmiConfig>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

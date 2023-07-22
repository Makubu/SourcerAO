import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './App.tsx';
import Fonts from './theme.font.tsx';
import theme from './theme.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Fonts />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

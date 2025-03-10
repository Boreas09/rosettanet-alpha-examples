import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { AppKitProvider } from './utils/appkitProvider';
import { walletConnect } from 'wagmi/connectors';
import ErrorBoundary from './components/errorBoundry';

const rosettanetSepolia = {
  id: 1381192787,
  name: 'Rosettanet',
  nativeCurrency: { name: 'Starknet Token', symbol: 'STRK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://alpha-deployment.rosettanet.io'] },
  },
  blockExplorers: {
    default: { name: 'Voyager', url: 'https://sepolia.voyager.online' },
  },
};

export const config = createConfig({
  chains: [rosettanetSepolia, sepolia],
  connectors: [
    walletConnect({
      projectId: '7e0b8c7d55dd9cad555623bf3c34da1c',
      isNewChainsStale: true,
      showQrModal: true,
      metadata: {
        name: 'Rosy',
        description: 'Rosettanet Alpha Examples',
        icons: ['https://assets.reown.com/reown-profile-pic.png'],
      },
    }),
  ],
  transports: {
    [rosettanetSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// root.render(
//   <StrictMode>
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <ColorModeScript />
//         <App />
//       </QueryClientProvider>
//     </WagmiProvider>
//   </StrictMode>
// );

window.onerror = function (message, source, lineno, colno, error) {
  if (message.includes('Cannot set property ethereum')) {
    return true; // Prevents the error from appearing in the console
  }
};

window.onunhandledrejection = function (event) {
  if (
    event.reason &&
    event.reason.message.includes('Cannot set property ethereum')
  ) {
    event.preventDefault(); // Prevents the error from propagating
  }
};

root.render(
  <ErrorBoundary>
    <StrictMode>
      <AppKitProvider>
        <ColorModeScript />
        <App />
      </AppKitProvider>
    </StrictMode>
  </ErrorBoundary>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

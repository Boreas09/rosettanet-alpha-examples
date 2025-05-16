import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppKitProvider } from './utils/appkitProvider';
import ErrorBoundary from './components/errorBoundry';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

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

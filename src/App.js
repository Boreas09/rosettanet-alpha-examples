import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { FullOpenDrawer } from './components/drawer';
import Starkgate from './views/starkgate/Starkgate';
import Home from './views/Home/Home';
import Avnu from './views/avnu/avnu';
import Unruggable from './views/unruggable/Unruggable';
import CurrStatus from './views/currStatus/currStatus';
import StarknetjsTrial from './views/starknetjsTrial/starknetjsTrial';
import Ethers from './views/ethers/ethers';
import EndurLst from './views/endurLst/endurLst';
import GetStarknetV5 from './views/getStarknetV5/getStarknetV5';

// Define the routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ChakraProvider theme={theme}>
        <FullOpenDrawer />
      </ChakraProvider>
    ),
    children: [
      {
        path: 'starkgate',
        element: <Starkgate />,
      },
      {
        index: true,
        element: <Home />, // Default page when visiting "/"
      },
      {
        path: 'avnu',
        element: <Avnu />,
      },
      {
        path: 'unruggable',
        element: <Unruggable />,
      },
      {
        path: 'ethers',
        element: <Ethers />,
      },
      {
        path: 'currentStatus',
        element: <CurrStatus />,
      },
      {
        path: 'starknetJS',
        element: <StarknetjsTrial />,
      },
      {
        path: 'endur',
        element: <EndurLst />,
      },
      {
        path: 'getStarknetV5',
        element: <GetStarknetV5 />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

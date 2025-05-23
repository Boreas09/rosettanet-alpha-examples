import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

export default function AddRosettanetXSTRK() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const addETH = async () => {
    if (window.ethereum && address) {
      setLoading(true);
      try {
        const tokenAddress = '0xb401bb848a7514a768e21c9f84cc6372c6629b59'; // Replace with your token's contract address
        const tokenSymbol = 'xSTRK'; // Replace with your token's symbol
        const tokenDecimals = 18; // Replace with your token's decimals

        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });

        if (wasAdded) {
          toast({
            title: 'Token successfully added to Wallet.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Token addition declined.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error adding token:', error);
        toast({
          title: 'Error.',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast({
        title: 'Wallet is not available. / Please Connect Your Wallet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Button isLoading my={2}>
        Add RosettaNet xSTRK
      </Button>
    );
  }

  return (
    <Button onClick={addETH} my={2}>
      Add RosettaNet xSTRK
    </Button>
  );
}

import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useChainId, useAccount } from 'wagmi';

export default function AddRosettanetChain() {
  const toast = useToast();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  async function addRosettanet() {
    if (window.ethereum && address) {
      setLoading(true);
      try {
        const wasAdded = await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x52535453',
              blockExplorerUrls: ['https://sepolia.voyager.online'],
              chainName: 'RosettaNet',
              nativeCurrency: {
                decimals: 18,
                name: 'STRK',
                symbol: 'STRK',
              },
              rpcUrls: ['https://rosettanet.onrender.com/'],
            },
          ],
        });

        if (wasAdded === null) {
          toast({
            title:
              'RosettaNet successfully added to Wallet. or changed to RosettaNet Chain.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        } else {
          if (chainId === 1381192787) {
            toast({
              title: 'RosettaNet already added, changed to RosettaNet Chain.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'RosettaNet addition declined.',
              status: 'error',
              duration: 9000,
              isClosable: true,
            });
          }
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message,
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
  }

  if (loading) {
    return (
      <Button isLoading minW={'100%'}>
        Adding RosettaNet Chain
      </Button>
    );
  }

  return (
    <Button onClick={addRosettanet} minW={'100%'}>
      Add RosettaNet Chain
    </Button>
  );
}

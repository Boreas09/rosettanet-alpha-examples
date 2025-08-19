import React, { useState } from 'react';
import {
  Button,
  Text,
  Card,
  CardBody,
  Stack,
  Link,
  useToast,
  Container,
  Input,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

export default function Ethers() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [recipient, setRecipient] = useState('');

  async function handleEthersConnection() {
    if (!window.ethereum) {
      toast({
        title: 'Ethereum wallet not found.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      return signer;
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: JSON.stringify(e),
        status: 'error',
        duration: 9000,
        isClosable: true,
        containerStyle: {
          height: '80px',
        },
      });
      return null;
    }
  }

  async function send(signer) {
    setLoading(true);

    if (!recipient) {
      setLoading(false);
      toast({
        title: 'Please Enter Recipient.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const tx = {
      chainId: 1381192787,
      to: recipient,
      value: ethers.parseEther('1'),
    };

    try {
      const txResponse = await signer.sendTransaction(tx);
      setLoading(false);
      setTransactions(prevData => [...prevData, txResponse.hash]);
    } catch (e) {
      setLoading(false);
      console.error(e);
      toast({
        title: 'Error',
        description: JSON.stringify(e),
        status: 'error',
        duration: 9000,
        isClosable: true,
        containerStyle: {
          height: '80px',
        },
      });
    }
  }

  async function switchToRosettanet() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x52535453' }],
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Please add RosettaNet Chain from left menu.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function handleFundTransfer() {
    await switchToRosettanet();
    const signer = await handleEthersConnection();
    if (!signer) return;

    await send(signer);
  }

  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Ethers Library Examples
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Ethers.js library to interact with the Starknet through
        Rosettanet.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          RosettaNet
        </Text>
        Chain.
      </Text>
      <Input
        placeholder="Enter Recipient ETH Address"
        mt={3}
        mb={3}
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <Button mt={2} mr={2} onClick={handleEthersConnection}>
        Connect With Ethers
      </Button>
      {loading ? (
        <Button mt={2} isLoading loadingText="Send 1 STRK">
          Send 1 STRK
        </Button>
      ) : (
        <Button mt={2} onClick={handleFundTransfer}>
          Send 1 STRK
        </Button>
      )}
      <Text mt={2} fontSize={'lg'} fontWeight={'bold'}>
        Transactions
      </Text>
      {transactions.map((tx, index) => (
        <Card key={tx} size={'sm'} borderRadius={'lg'} my={5}>
          <CardBody size={'sm'}>
            <Stack>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Transaction {index + 1}
              </Text>
              <Text fontSize={'sm'}>Transaction Hash: {tx}</Text>
              <Link
                fontSize={'sm'}
                href={`https://sepolia.voyager.online/tx/${tx}`}
                isExternal
              >
                View on Voyager
              </Link>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Container>
  );
}

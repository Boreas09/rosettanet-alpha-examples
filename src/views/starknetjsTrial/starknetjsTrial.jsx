import React, { useState } from 'react';
import { RosettanetAccount } from 'starknet';
import {
  Box,
  Container,
  Text,
  Heading,
  useToast,
  Button,
} from '@chakra-ui/react';
import { connect } from '@starknet-io/get-starknet';

export default function StarknetjsTrial() {
  const [walletName, setWalletName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [blockNumber, setBlockNumber] = useState('0x0');
  const toast = useToast();

  function handleConnect() {
    return async () => {
      const res = await connect();
      console.log(res);
      setWalletName(res?.name || '');
      setSelectedAccount(res);
    };
  }

  async function connectJs() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: 'https://alpha-deployment.starknet.io',
        },
        selectedAccount
      );
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      try {
        rAccount.walletProvider
          .request({ method: 'eth_blockNumber' })
          .then(res => {
            console.log(res);
            setBlockNumber(res);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Heading as="h2" size="lg" my={4}>
        Connect With Starknet.js
      </Heading>
      <Text as="cite" fontSize={'sm'}>
        This part you can connect to Starknet with using Starknet.js and
        get-starknet. It will connect with MetaMask for now. Supports both
        Starknet and Ethereum requests. Both Metamask and Metamask Snaps will be
        in modal. Metamask Normal is the one added.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        If your wallet is connected before this page, please disconnect it from
        left side. If not there will be an error.
      </Text>
      <Box width="100%" my={4} gap={4} display="flex">
        <Button onClick={handleConnect()}>Connect With get-starknet</Button>
        <Button onClick={connectJs}>
          Get Block Number of Starknet Sepolia
        </Button>
      </Box>
      <Text>Block Number : {parseInt(blockNumber, 16)}</Text>
      <Text>Wallet Name : {walletName}</Text>
    </Container>
  );
}

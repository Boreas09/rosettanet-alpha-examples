import React, { useState } from 'react';
import { RosettanetAccount } from 'starknet';
import {
  Box,
  Container,
  Text,
  Heading,
  useToast,
  Button,
  Code,
} from '@chakra-ui/react';
import { connect } from '@starknet-io/get-starknet';

export default function StarknetjsTrial() {
  const [walletName, setWalletName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [callMethodResults, setCallMethodResults] = useState({
    blockNumber: '',
    chainId: '',
    estimateGas: '',
    gasPrice: '',
    getBalance: '',
    getBlockByHash: '',
    getBlockByNumber: '',
    getBlockTransactionCountByHash: '',
    getBlockTransactionCountByNumber: '',
    getCode: '',
    getTransactionHashByBlockHashAndIndex: '',
    getTransactionHashByBlockNumberAndIndex: '',
    getTransactionByHash: '',
    getTransactionCount: '',
    getTransactionReceipt: '',
    permissions: '',
  });
  const toast = useToast();

  function handleConnect() {
    return async () => {
      const res = await connect();
      console.log(res);
      setWalletName(res?.name || '');
      setSelectedAccount(res);
    };
  }

  async function getCallMethods() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: 'https://alpha-deployment.rosettanet.io',
        },
        selectedAccount
      );
    } else {
      console.log('Please connect with get-starknet');
    }

    const tx = {
      from: rAccount.address,
      to: rAccount.address,
      value: '0x9184e72a',
    };

    if (rAccount) {
      try {
        await rAccount.blockNumberRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            blockNumber: parseInt(res, 16),
          }));
        });

        await rAccount.chainIdRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            chainId: res,
          }));
        });

        // await rAccount.getPermissionsRosettanet().then((res) => {
        //   console.log(res);
        //   setCallMethodResults((prev) => ({
        //     ...prev,
        //     permissions: res,
        //   }));
        // });

        await rAccount.estimateGasRosettanet(tx).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            estimateGas: res,
          }));
        });

        await rAccount.gasPriceRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            gasPrice: res,
          }));
        });

        await rAccount.getBalanceRosettanet(rAccount.address).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getBalance: res,
          }));
        });

        await rAccount
          .getBlockByHashRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockByHash: res,
            }));
          });

        await rAccount.getBlockByNumberRosettanet('0x123').then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getBlockByNumber: res,
          }));
        });

        await rAccount
          .getBlockTransactionCountByHashRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockTransactionCountByHash: res,
            }));
          });

        await rAccount
          .getBlockTransactionCountByNumberRosettanet('0x123')
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockTransactionCountByNumber: res,
            }));
          });

        await rAccount.getCodeRosettanet(rAccount.address).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getCode: res,
          }));
        });

        await rAccount
          .getTransactionHashByBlockHashAndIndexRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7',
            1
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionHashByBlockHashAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionHashByBlockNumberAndIndexRosettanet('0x123', 1)
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionHashByBlockNumberAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionByHashRosettanet(
            '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionByHash: res,
            }));
          });

        await rAccount
          .getTransactionCountRosettanet(rAccount.address)
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionCount: res,
            }));
          });

        await rAccount
          .getTransactionReceiptRosettanet(
            '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionReceipt: res,
            }));
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function signMessage() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: 'https://alpha-deployment.rosettanet.io',
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
        await rAccount
          .personalSignRosettanet('Hello World', rAccount.address)
          .then(res => {
            console.log(res);
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
        <Button onClick={getCallMethods}>Get Call Methods</Button>
        <Button onClick={signMessage}>Sign Message</Button>
      </Box>
      <Text>Wallet Name : {walletName}</Text>
      <Code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(callMethodResults, null, 2)}
      </Code>
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
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
  Spinner,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { getStarknetAddress } from '../../utils/starknetUtils';
import { cairo } from 'starknet';
import { parseEther } from 'ethers';
import BigNumber from 'bignumber.js';
import { EvmWalletsWithStarknetFeatures } from 'rosettanet';

export default function GetStarknetV5() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [wallets, setWallets] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    async function getWallets() {
      const availableWallets = await EvmWalletsWithStarknetFeatures();
      setWallets(availableWallets);
    }
    getWallets();
  }, []);

  const handleConnect = wallet => {
    try {
      wallet.features['standard:connect'].connect();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to connect to ${wallet.injected.name}: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  };

  const handleDisconnect = wallet => {
    try {
      wallet.features['standard:disconnect'].disconnect();
      toast({
        title:
          'Disconnecting can be tricky because we have a lot of wallet libraries but once you disconnect with get-starknet v5 you cannot send any requests with it.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to disconnect from ${wallet.injected.name}: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  };

  const avnu = async wallet => {
    try {
      setLoading(true);

      if (!wallet.accounts[0]) {
        toast({
          title: 'Please Connect Your Wallet With Get-Starknet V5.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const address = wallet.accounts[0].address;

      const snAddress = await getStarknetAddress(address);

      const getQuotes = await fetch(
        'https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000&onlyDirect=true&PULSAR_MONEY_FEE_RECIPIENT.value=0'
      );
      const getQuotesResponse = await getQuotes.json();
      const quoteId = getQuotesResponse[0].quoteId;

      const postBody = {
        quoteId: quoteId,
        takerAddress: snAddress,
        slippage: '0.05',
        includeApprove: true,
      };

      const buildSwapData = await fetch(
        'https://sepolia.api.avnu.fi/swap/v2/build',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        }
      );

      const buildSwapDataResponse = await buildSwapData.json();

      const calldata = [
        {
          contractAddress:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          entrypoint: 'approve',
          calldata: buildSwapDataResponse.calls[0].calldata,
        },
        {
          contractAddress:
            '0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2',
          entrypoint: 'multi_route_swap',
          calldata: buildSwapDataResponse.calls[1].calldata,
        },
      ];

      const response = await wallet.features['starknet:walletApi'].request({
        type: 'wallet_addInvokeTransaction',
        params: calldata,
      });

      console.log('Transaction sent:', response);
      setTransactions(prevData => [...prevData, response]);
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
    } finally {
      setLoading(false);
    }
  };

  const endurLstStake = async wallet => {
    try {
      setLoading(true);

      if (!wallet.accounts[0]) {
        toast({
          title: 'Please Connect Your Wallet With Get-Starknet V5.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const address = wallet.accounts[0].address;

      const snAddress = await getStarknetAddress(address);

      const starkAmount = cairo.uint256(parseEther('1'));

      const calldata = [
        {
          contractAddress:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          entrypoint:
            '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
          calldata: [
            '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        },
        {
          contractAddress:
            '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
          entrypoint:
            '0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01',
          calldata: [
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
            snAddress,
          ],
        },
      ];

      const response = await wallet.features['starknet:walletApi'].request({
        type: 'wallet_addInvokeTransaction',
        params: calldata,
      });

      console.log('Transaction sent:', response);
      setTransactions(prevData => [...prevData, response]);
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
    } finally {
      setLoading(false);
    }
  };

  const sendSTRK = async wallet => {
    try {
      setLoading(true);
      if (!wallet.accounts[0]) {
        toast({
          title: 'Please Connect Your Wallet With Get-Starknet V5.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

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

      const address = wallet.accounts[0].address;

      const snAddress = await getStarknetAddress(address);

      const starkAmount = cairo.uint256(parseEther('1'));

      const calldata = [
        {
          contractAddress:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          entrypoint:
            '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
          calldata: [
            snAddress,
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        },
        {
          contractAddress:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          entrypoint:
            '0x0083afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
          calldata: [
            recipient,
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        },
      ];

      const response = await wallet.features['starknet:walletApi'].request({
        type: 'wallet_addInvokeTransaction',
        params: calldata,
      });

      console.log('Transaction sent:', response);
      setTransactions(prevData => [...prevData, response]);
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
    } finally {
      setLoading(false);
    }
  };

  const signMessage = async wallet => {
    try {
      setLoading(true);
      if (!wallet.accounts[0]) {
        toast({
          title: 'Please Connect Your Wallet With Get-Starknet V5.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const snMSG = {
        domain: {
          name: 'DappLand',
          chainId: 1381192787,
          version: '1.0.2',
        },
        message: {
          name: 'MonKeyCollection',
          value: 2312,
          // do not use BigInt type if message sent to a web browser
        },
        primaryType: 'Simple',
        types: {
          Simple: [
            {
              name: 'name',
              type: 'shortstring',
            },
            {
              name: 'value',
              type: 'u128',
            },
          ],
          StarknetDomain: [
            {
              name: 'name',
              type: 'shortstring',
            },
            {
              name: 'chainId',
              type: 'shortstring',
            },
            {
              name: 'version',
              type: 'shortstring',
            },
          ],
        },
      };

      const response = await wallet.features['starknet:walletApi'].request({
        type: 'wallet_signTypedData',
        params: JSON.stringify(snMSG),
      });

      setSignatures(prevData => [...prevData, response]);
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
    } finally {
      setLoading(false);
    }
  };

  const watchAsset = async wallet => {
    try {
      setLoading(true);
      if (!wallet.accounts[0]) {
        toast({
          title: 'Please Connect Your Wallet With Get-Starknet V5.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const tokenAddress = '0xb5e1278663de249f8580ec51b6b61739bd906215'; // Replace with your token's contract address
      const tokenSymbol = 'ETH'; // Replace with your token's symbol
      const tokenDecimals = 18; // Replace with your token's decimals

      const asset = {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
      };

      const response = await wallet.features['starknet:walletApi'].request({
        type: 'wallet_watchAsset',
        params: asset,
      });

      console.log('Asset watched:', response);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Get Starknet V5 Examples
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using get-starknet V5 library to interact with the Starknet
        through Rosettanet.
      </Text>
      <UnorderedList>
        <ListItem>Avnu button swaps 1 STRK to 1 ETH via Avnu</ListItem>
        <ListItem>
          Endur LST button stakes 1 STRK and returns xSTRK via Endur
        </ListItem>
        <ListItem>
          Send 1 STRK button sends 1 STRK to recipient address
        </ListItem>
      </UnorderedList>
      <Input
        placeholder="Enter Recipient Starknet Address"
        mt={3}
        mb={3}
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          RosettaNet
        </Text>
        Chain.
      </Text>
      <Text my={2} fontSize={'lg'} fontWeight={'bold'}>
        Available Wallets
      </Text>
      {wallets.map(wallet => {
        return (
          <Card
            key={wallet.injected.name}
            size={'sm'}
            borderRadius={'lg'}
            mb={5}
          >
            <CardBody size={'sm'}>
              <Stack>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  {wallet.injected.name}
                </Text>
                {loading && <Spinner />}
                <Stack direction={'row'} spacing={2}>
                  <Button onClick={() => handleConnect(wallet)}>Connect</Button>
                  <Button onClick={() => handleDisconnect(wallet)}>
                    Disconnect
                  </Button>
                  <Button
                    onClick={() => {
                      avnu(wallet);
                    }}
                  >
                    Avnu
                  </Button>
                  <Button
                    onClick={() => {
                      endurLstStake(wallet);
                    }}
                  >
                    Endur LST Stake
                  </Button>
                  <Button
                    onClick={() => {
                      sendSTRK(wallet);
                    }}
                  >
                    Send 1 STRK
                  </Button>
                  <Button
                    onClick={() => {
                      signMessage(wallet);
                    }}
                  >
                    Sign
                  </Button>
                  <Button
                    onClick={() => {
                      watchAsset(wallet);
                    }}
                  >
                    watchAsset
                  </Button>
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        );
      })}

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
      {signatures.map((sig, index) => (
        <Card key={sig} size={'sm'} borderRadius={'lg'} my={5}>
          <CardBody size={'sm'}>
            <Stack>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Signature {index + 1}
              </Text>
              <Text fontSize={'sm'}>Signature Hash: {sig}</Text>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Container>
  );
}

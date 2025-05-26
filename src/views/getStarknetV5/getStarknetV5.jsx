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
} from '@chakra-ui/react';
import {
  EvmWindowObjectWithStarknetKeys,
  EthereumInjectedWallet,
} from 'rosettanet-get-starknet-impl';

export default function GetStarknetV5() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    async function getWallets() {
      const availableWallets = await EvmWindowObjectWithStarknetKeys();
      setWallets(availableWallets);
    }
    getWallets();
  }, []);

  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Get Starknet V5 Examples
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using get-starknet V5 library to interact with the Starknet
        through Rosettanet.
      </Text>
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
        let injectedWallet = new EthereumInjectedWallet(wallet);
        return (
          <Card
            key={injectedWallet.injected.name}
            size={'sm'}
            borderRadius={'lg'}
            mb={5}
          >
            <CardBody size={'sm'}>
              <Stack>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  {injectedWallet.injected.name}
                </Text>
                <Stack direction={'row'} spacing={2}>
                  <Button
                    onClick={() =>
                      injectedWallet.features['standard:connect'].connect()
                    }
                  >
                    Connect
                  </Button>
                  <Button
                    onClick={() =>
                      wallet.features['standard:disconnect'].disconnect()
                    }
                  >
                    Disconnect
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
    </Container>
  );
}

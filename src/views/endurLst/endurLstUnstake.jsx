import React from 'react';
import {
  Box,
  Button,
  Text,
  Input,
  Card,
  CardBody,
  Stack,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getStarknetAddress } from '../../utils/starknetUtils';
import { parseEther } from 'ethers';
import { calldataWithEncode } from '../../utils/multicall';
import { sendTransaction } from '@wagmi/core';
import { cairo } from 'starknet';
import BigNumber from 'bignumber.js';
import { reownConfig } from '../../utils/appkitProvider';

export default function EndurLstUnstake() {
  const { address, chainId } = useAccount();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleUnstake = async () => {
    setLoading(true);

    const snAddress = (await getStarknetAddress(address)).toString(16);

    if (!address) {
      toast({
        title: 'Please Connect Your Wallet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (chainId !== 1381192787) {
      toast({
        title: 'Please connect with RosettaNet Chain.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const starkAmount = cairo.uint256(parseEther(amount));
      const calldata = [
        [
          '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
          '0x15511cc3694f64379908437d6d64458dc76d02482052bfb8a5b33a72c054c77',
          [
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
            snAddress,
            snAddress,
          ],
        ],
      ];

      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: address,
        value: parseEther('0'),
        data: calldataWithEncode(calldata),
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

  return (
    <Box>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Endur LST Unstaking
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Endur LST to unstake xSTRK and get STRK. After
        transaction successfully sent we can see our STRK amount in Rosettanet
        chain in Wallet. Unstaking STRK can take a long time ~21 days. You can
        see how long it will take below.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          Rosettanet
        </Text>{' '}
        Chain.
      </Text>
      <Input
        placeholder="Enter xSTRK Amount"
        mt={3}
        mb={3}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {loading ? (
        <Button mt={2} isLoading loadingText="Unstake STRK">
          Unstake STRK
        </Button>
      ) : (
        <Button mt={2} onClick={handleUnstake}>
          Unstake STRK
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
    </Box>
  );
}

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
import AddRosettanetXSTRK from '../../components/addRosettanetxSTRK';

export default function EndurLstStake() {
  const { address, chainId } = useAccount();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    setLoading(true);

    const snAddress = '0x' + (await getStarknetAddress(address)).toString(16);

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
          '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
          [
            '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        ],
        [
          '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
          '0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01',
          [
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
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
        Endur LST Staking
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Endur LST to stake STRK and get xSTRK. After transaction
        successfully sent we can see our xSTRK amount in Rosettanet chain in
        Wallet.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          Rosettanet
        </Text>{' '}
        Chain.
      </Text>
      <AddRosettanetXSTRK />
      <Input
        placeholder="Enter STRK Amount"
        mt={3}
        mb={3}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {loading ? (
        <Button mt={2} isLoading loadingText="Stake STRK">
          Stake STRK
        </Button>
      ) : (
        <Button mt={2} onClick={handleStake}>
          Stake STRK
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

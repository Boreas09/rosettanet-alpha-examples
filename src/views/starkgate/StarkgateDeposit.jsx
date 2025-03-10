import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
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
import { getStarknetAddress } from '../../utils/starknetUtils';
import { parseEther } from 'ethers';

const starkgateSepoliaAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'l2Recipient',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default function StarkgateDeposit() {
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract({
    abi: starkgateSepoliaAbi,
  });
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
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

    if (chainId !== 11155111) {
      toast({
        title: 'Please connect with Ethereum Sepolia Chain.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (!amount) {
      toast({
        title: 'Please enter amount.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const snAddress = await getStarknetAddress(address);

    try {
      const response = await writeContractAsync({
        abi: starkgateSepoliaAbi,
        address: '0x8453fc6cd1bcfe8d4dfc069c400b433054d47bdc',
        functionName: 'deposit',
        args: [
          '0x0000000000000000000000000000000000455448', // token address
          parseEther(amount), // amount (in wei)
          snAddress, // L2 recipient
        ],
        value: parseEther(amount) + parseEther('0.01'), // ETH value to send (in wei)
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
        Starkgate Deposit from ETH to Starknet
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Starkgate to send ETH from Ethereum to Starknet. After
        successfully sent we can see our ETH amount in Rosettanet chain in
        Wallet.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          Ethereum Sepolia
        </Text>{' '}
        Chain.
      </Text>
      <Input
        placeholder="Enter Amount"
        mt={3}
        mb={3}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {loading ? (
        <Button mt={2} isLoading loadingText="Deposit ETH">
          Deposit ETH
        </Button>
      ) : (
        <Button mt={2} onClick={handleDeposit}>
          Deposit ETH
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
                href={`https://sepolia.etherscan.io/tx/${tx}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
}

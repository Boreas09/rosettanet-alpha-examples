import { useState } from 'react';
import { useAccount } from 'wagmi';
import { sendTransaction } from '@wagmi/core';
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
import { parseEther } from 'ethers';
import { calldataWithEncode } from '../../utils/multicall';
import { useAppKitAccount } from '@reown/appkit/react';
import { cairo } from 'starknet';
import BigNumber from 'bignumber.js';
import { reownConfig } from '../../utils/appkitProvider';

export default function StarkgateWithdraw() {
  const { chainId } = useAccount();
  const { address } = useAppKitAccount();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
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

    try {
      const starkAmount = cairo.uint256(parseEther(amount));

      const withdrawCalldata = [
        //send ethereum ile iletişim
        [
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
          '0x0083afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
          [
            '0x7D33254052409C04510C3652BC5BE5656F1EFF1B131C7C031592E3FA73F1F70',
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        ],
        [
          '0x04c5772d1914fe6ce891b64eb35bf3522aeae1315647314aac58b01137607f3f',
          '0x00e5b455a836c7a254df57ed39d023d46b641b331162c6c0b369647056655409',
          [
            '455448',
            address,
            '0x' + new BigNumber(starkAmount.low).toString(16),
            '0x' + new BigNumber(starkAmount.high).toString(16),
          ],
        ],
      ];
      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: address,
        value: parseEther('0'),
        data: calldataWithEncode(withdrawCalldata),
        gasLimit: 90000,
        type: 'eip1559',
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
        Starkgate Withdraw from Starknet to ETH
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Starkgate to send ETH from Starknet to Ethereum. After
        successfully sent we can see our ETH amount in Ethereum Sepolia chain in
        Wallet.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          RosettaNet
        </Text>
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
        <Button mt={2} isLoading loadingText="Withdraw ETH">
          Withdraw ETH
        </Button>
      ) : (
        <Button mt={2} onClick={handleWithdraw}>
          Withdraw ETH
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

import { useState } from 'react';
import {
  Button,
  Container,
  Input,
  Text,
  useToast,
  Stack,
  Card,
  CardBody,
  Link,
} from '@chakra-ui/react';
import { sendTransaction } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { calldataWithEncode } from '../../utils/multicall';
import { parseEther } from 'viem';
import { getStarknetAddress } from '../../utils/starknetUtils';
import { cairo } from 'starknet';
import { asciiToHex } from '../../utils/asciiToHex';
import BigNumber from 'bignumber.js';
import { reownConfig } from '../../utils/appkitProvider';

export default function Unruggable() {
  const { address, chainId } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [contractSalt, setContractSalt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async e => {
    e.preventDefault();

    setLoading(true);
    if (!address) {
      toast({
        title: 'Please Connect Your Wallet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (chainId !== 1381192787) {
      toast({
        title: 'Please connect with RosettaNet Chain.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (
      tokenName.length > 30 ||
      tokenSymbol.length > 30 ||
      contractSalt.length > 30
    ) {
      toast({
        title:
          'Name, Symbol and Salt needs to be felt252. Less than 30 characters',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const initialSupplyUint256 = cairo.uint256(initialSupply);

    if (
      cairo.isTypeUint256([
        new BigNumber(initialSupplyUint256.low, 16),
        new BigNumber(initialSupplyUint256.high, 16),
      ])
    ) {
      toast({
        title: 'initialSupply needs to be Uint256.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const snAddress = await getStarknetAddress(address);

    const createMemecoinCalldata = [
      [
        '0x00494a72a742b7880725a965ee487d937fa6d08a94ba4eb9e29dd0663bc653a2',
        '0x014b9c006653b96dd1312a62b5921c465d08352de1546550f0ed804fcc0ef9e9',
        [
          snAddress,
          '0x' + asciiToHex(tokenName),
          '0x' + asciiToHex(tokenSymbol),
          '0x' + initialSupplyUint256.low.toString(16),
          '0x' + initialSupplyUint256.high.toString(16),
          '0x' + asciiToHex(contractSalt),
        ],
      ],
    ];

    try {
      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: address,
        value: parseEther('0'),
        data: calldataWithEncode(createMemecoinCalldata),
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
    <Container maxW="3xl" overflow={'hidden'}>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Creating a token with using Unruggable Meme
      </Text>
      <Text as="cite" fontSize={'sm'}>
        This part using Unruggable Meme to create a token with given parameters.
        After successfully sent we can see our token in starknet sepolia
        explorer.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        Wallet needs to be in{' '}
        <Text as="mark" bgColor={'#BCCCDC'} px={2}>
          RosettaNet
        </Text>{' '}
        Chain.
      </Text>
      <form onSubmit={handleCreate} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Token Name"
            aria-label="Token Name"
            value={tokenName}
            onChange={e => setTokenName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Token Symbol"
            aria-label="Token Symbol"
            value={tokenSymbol}
            onChange={e => setTokenSymbol(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Token Initial Supply"
            aria-label="Token Initial Supply"
            type="number"
            min="0"
            value={initialSupply}
            onChange={e => setInitialSupply(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Token Contract Address Salt"
            aria-label="Token Contract Address Salt"
            value={contractSalt}
            onChange={e => setContractSalt(e.target.value)}
            required
          />
        </div>
        {loading ? (
          <Button mt={1} isLoading loadingText="Create Memecoin" type="submit">
            Create Memecoin
          </Button>
        ) : (
          <Button mt={1} type="submit">
            Create Memecoin
          </Button>
        )}
      </form>
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

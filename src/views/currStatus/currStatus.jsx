import React from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

export default function CurrStatus() {
  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Heading as="h2" size="lg" my={4}>
        Current Status of RosettaNet
      </Heading>
      <Box py={6}>
        {/* Overview Section */}
        <Heading as="h2" size="lg" mb={4}>
          Wallets
        </Heading>
        <Text mb={4}>
          Currently Metamask works perfectly with RosettaNet. We are trying to
          make Trust Wallet and Coinbase Wallet compatible with RosettaNet.
          Trust and Coinbase using legacy type transactions and our node does
          not support legacy transactions.
        </Text>

        <Text fontWeight="bold" mb={2}>
          MetaMask
        </Text>
        <UnorderedList mb={4}>
          <ListItem>Can add RosettaNet Chain.</ListItem>
          <ListItem>Can add RosettaNet ETH.</ListItem>
          <ListItem>Can send Tx.</ListItem>
        </UnorderedList>

        <Text fontWeight="bold" mb={2}>
          Trust Wallet
        </Text>
        <UnorderedList mb={4}>
          <ListItem>Can add RosettaNet Chain.</ListItem>
          <ListItem>Can add RosettaNet ETH.</ListItem>
          <ListItem>
            Can't sent Tx, Wallet gives unsupported chain error.
          </ListItem>
        </UnorderedList>

        <Text fontWeight="bold" mb={2}>
          Coinbase Wallet
        </Text>
        <UnorderedList mb={4}>
          <ListItem>Can add RosettaNet Chain.</ListItem>
          <ListItem>Can't add RosettaNet ETH.</ListItem>
          <ListItem>
            Can't sent Tx, needs to support legacy tx with multicall. Sending
            STRK from Address 1 to Address 2 by Coinbase wallet works.
          </ListItem>
        </UnorderedList>

        <Text fontWeight="bold" mb={2}>
          Phantom Wallet
        </Text>
        <UnorderedList mb={4}>
          <ListItem>
            Can't add RosettaNet Chain. Wallet do not allow to add a new chain
          </ListItem>
        </UnorderedList>

        {/* Project Structure Section */}
        <Heading as="h2" size="lg" mb={4}>
          Available Transactions
        </Heading>

        <Text fontWeight="bold" mb={2}>
          Starkgate
        </Text>
        <Text mb={4}>
          Works perfectly fine with RosettaNet. We can deposit and withdraw ETH.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Avnu
        </Text>
        <Text mb={4}>Works perfectly fine with RosettaNet.</Text>

        <Text fontWeight="bold" mb={2}>
          Unruggable
        </Text>
        <Text mb={4}>
          Works perfectly fine with RosettaNet. We can create a meme token using
          Metamask. Launching token will be added in a short time.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Endur LST xSTRK
        </Text>
        <Text mb={4}>Works perfectly fine with RosettaNet.</Text>
      </Box>
    </Container>
  );
}

import React from 'react';
import { Box, Container, Text, Heading } from '@chakra-ui/react';

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
          Currently most of the wallets are working on Rosettanet. Metamask
          working great. Trust Wallet unfortunately not working with RosettaNet,
          we think they need to add Rosettanet Chain to their own cache. Phantom
          Wallet is not allowing to add a new chain.
        </Text>

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
      </Box>
    </Container>
  );
}

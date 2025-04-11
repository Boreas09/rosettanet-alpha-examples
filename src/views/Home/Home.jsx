import React from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Heading as="h2" size="lg" my={4}>
        This is a webpage for BETA testing RosettaNet.
      </Heading>
      <Heading as="h2" size="lg" my={4}>
        First Transaction Requests Could Be Slow Due to Backend
        Provider.(Render.com)
      </Heading>
      <Box py={6}>
        <Link
          href="https://github.com/Digine-Labs/rosettanet"
          isExternal
          size="lg"
        >
          <Heading as="h2" size="lg" my={4}>
            Github Repository
          </Heading>
        </Link>
        {/* Overview Section */}
        <Heading as="h2" size="lg" mb={4}>
          Overview
        </Heading>
        <Text mb={4}>
          Rosetta is a middleware software that acts like an Ethereum RPC. It
          makes requests to the Starknet network while outputting Ethereum RPC
          outputs. This allows users to interact with Starknet the same as they
          interact with the EVM-compatible chain.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Rosetta
        </Text>
        <UnorderedList mb={4}>
          <ListItem>Rosetta is not a Starknet node itself.</ListItem>
          <ListItem>
            Rosetta needs a working Starknet node to be connected.
          </ListItem>
          <ListItem>
            Rosetta can handle both Starknet and Ethereum RPC requests.
          </ListItem>
        </UnorderedList>

        <Text fontWeight="bold" mb={2}>
          What does Rosetta benefit to users?
        </Text>
        <UnorderedList mb={4}>
          <ListItem>
            You can connect and interact protocols in Starknet with your
            existing EVM wallet (Metamask, Trust wallet, Hardware wallets, etc.)
          </ListItem>
          <ListItem>
            You can use Rosetta on local. There is no sync needed. Simply, users
            can clone the repo and use their local Rosetta node to connect to
            Starknet.
          </ListItem>
          <ListItem>
            You can use L1 interactive protocols by just changing the network on
            your wallet.
          </ListItem>
        </UnorderedList>

        <Text fontWeight="bold" mb={2}>
          What does Rosetta benefit to devs?
        </Text>
        <UnorderedList mb={4}>
          <ListItem>
            You can use all EVM-compatible libraries. (Ethers, web3js, etc.)
          </ListItem>
          <ListItem>
            If you want to migrate your project from the EVM chain to Starknet,
            all you need to do is develop your smart contracts with Cairo. You
            just need to care about providing the same ABI in both. You don't
            need to make any changes on frontend or backend. Rosetta handles all
            of these.
          </ListItem>
        </UnorderedList>

        <Text fontStyle="italic" mb={8}>
          Rosetta aims to give EVM experience to users where they won't ever
          notify they are using Starknet.
        </Text>

        {/* Project Structure Section */}
        <Heading as="h2" size="lg" mb={4}>
          Project structure
        </Heading>

        <Text fontWeight="bold" mb={2}>
          RosettaNet:
        </Text>
        <Text mb={4}>
          Middleware software, core part of Rosetta. It acts like a gateway
          between Starknet and the user. It formats Ethereum RPC requests to the
          format that Starknet RPC accepts, and formats Starknet RPC responses
          into Ethereum RPC response. Written in Typescript. In future it also
          will be developed with Rust.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Rosetta Accounts:
        </Text>
        <Text mb={4}>
          Account smart contract library will be written in Cairo. Custom
          account contracts that are able to verify Ethereum account signatures
          on Starknet to execute and verify transactions.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Rosetta Verifier:
        </Text>
        <Text mb={4}>
          Starknet smart contracts that verify signatures with format EIP-1559.
          Converts EVM calldatas into Starknet calldata. This is the core part
          to achieve non-trusted setup.
        </Text>

        <Text fontWeight="bold" mb={2}>
          Lens:
        </Text>
        <Text mb={4}>
          Permissionless Starknet smart contract that matches Ethereum addresses
          with Starknet addresses.
        </Text>

        <Text fontStyle="italic">
          *Additional extensions will be developed to provide integrability for
          existing Starknet protocols.*
        </Text>
      </Box>
    </Container>
  );
}

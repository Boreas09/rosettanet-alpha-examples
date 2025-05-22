import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Box,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useColorModeValue,
  Stack,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { HamburgerIcon } from '@chakra-ui/icons';
import AddRosettanetChain from './addRosettanetChain';
import AddRosettanetETH from './addRosettanetETH';
import ActiveChain from './activeChain';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  if (address) {
    return (
      <Button onClick={() => disconnect()} minW={'100%'}>
        {address.slice(0, 9)}
      </Button>
    );
  } else {
    return connectors.map(connector => (
      <Button
        key={connector.uid}
        onClick={() => {
          connect({ connector });
        }}
        minW={'100%'}
      >
        {connector.name}
      </Button>
    ));
  }
}

export function FullOpenDrawer() {
  const sidebar = useDisclosure();
  const color = useColorModeValue('gray.600', 'gray.300');
  const { chains, switchChain } = useSwitchChain();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();

  const NavItem = ({ icon, to, children, ...rest }) => (
    <NavLink to={to} style={{ textDecoration: 'none', width: '100%' }}>
      {({ isActive }) => (
        <Flex
          align="center"
          px="4"
          py="3"
          cursor="pointer"
          color={isActive ? 'gray.800' : 'inherit'}
          bg={isActive ? 'gray.100' : 'transparent'}
          _hover={{
            bg: 'gray.50',
            color: 'gray.900',
          }}
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icon && (
            <Icon
              mx="2"
              boxSize="4"
              color={isActive ? 'blue.500' : color}
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </NavLink>
  );

  const SidebarContent = props => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="4" align="center">
        <Text fontSize="xl" fontWeight="semibold" align="center">
          RosettaNet Test Website
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem to="/">Home</NavItem>
        <NavItem to="/currentStatus">Current Status</NavItem>
        <NavItem to="/starkgate">Starkgate</NavItem>
        <NavItem to="/avnu">Avnu</NavItem>
        {/* <NavItem to="/ekubo">Ekubo</NavItem> */}
        {/* <NavItem to="/nostra">Nostra</NavItem> */}
        <NavItem to="/unruggable">Unruggable</NavItem>
        <NavItem to="/endur">Endur LST xSTRK</NavItem>
        <NavItem to="/starknetJS">StarknetJS</NavItem>
        <NavItem to="/ethers">Ethers</NavItem>
        <Flex
          px="4"
          py="4"
          align="center"
          direction={'column'}
          fontSize="md"
          fontWeight="semibold"
        >
          <Stack minW={'100%'} my={4}>
            <Text>Connect Wallet</Text>
            {address ? (
              <Button onClick={() => open({ view: 'Account' })}>
                {address.slice(0, 9)}
              </Button>
            ) : (
              <Button onClick={open}>Connect Wallet</Button>
            )}
            {/* <WalletOptions /> */}
          </Stack>
          <Stack minW={'100%'} my={2}>
            <ActiveChain />
          </Stack>
          <Stack minW={'100%'} my={2}>
            <Text>Add RosettaNet Chain to Wallet</Text>
            <AddRosettanetChain />
          </Stack>
          <Stack minW={'100%'} my={2}>
            <Text>Add RosettaNet ETH to Wallet</Text>
            <AddRosettanetETH />
          </Stack>
          <Stack minW={'100%'} my={2}>
            <Text>Chain Switcher</Text>
            {chains.map(chain => (
              <Button
                key={chain.id}
                onClick={() => switchChain({ chainId: chain.id })}
                minW={'100%'}
              >
                {chain.name}
              </Button>
            ))}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: 'none',
          md: 'unset',
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w={320} borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="flex-start"
          gap={6}
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: 'gray.800',
          }}
          display={{
            base: 'inline-flex',
            md: 'none',
          }}
          borderBottomWidth="1px"
          color="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{
              base: 'inline-flex',
              md: 'none',
            }}
            onClick={sidebar.onOpen}
            icon={<HamburgerIcon />}
            size="sm"
          />
          <Text fontSize="xl" fontWeight="semibold" align="center">
            RosettaNet Test Website
          </Text>
        </Flex>
        <Box as="main" p="4">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

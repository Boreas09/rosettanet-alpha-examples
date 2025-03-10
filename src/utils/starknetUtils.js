import { RpcProvider, Contract } from 'starknet';

export async function getStarknetAddress(address) {
  const starknetProvider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
  });

  const contractAddress =
    '0x007288a71619eca9397bf0d3066d236b41de33fd6af3a420d16b2f55c93f8af7';

  const { abi: testAbi } = await starknetProvider.getClassAt(contractAddress);
  if (testAbi === undefined) {
    throw new Error('no abi.');
  }
  const rosettaContract = new Contract(
    testAbi,
    contractAddress,
    starknetProvider
  );

  // Interaction with the contract with call
  const addr = await rosettaContract.get_starknet_address_with_fallback(
    address
  );

  return addr;
}

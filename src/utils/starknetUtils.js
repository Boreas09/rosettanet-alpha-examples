import { RpcProvider, Contract } from 'starknet';

export async function getStarknetAddress(address) {
  const starknetProvider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
  });

  const contractAddress =
    '0x06c5d28b29809c2481ff8ae65555bf6a30f161aa2a0dcd8f8189bba61e010d65';

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
  const addressSN = '0x' + (await addr.toString(16));

  return addressSN;
}

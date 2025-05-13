import { RpcProvider, Contract } from 'starknet';

export async function getStarknetAddress(address) {
  const starknetProvider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
  });

  const contractAddress =
    '0x06c5d28b29809c2481ff8ae65555bf6a30f161aa2a0dcd8f8189bba61e010d65';

  const { abi: contractAbi } = await starknetProvider.getClassAt(
    contractAddress
  );
  if (contractAbi === undefined) {
    throw new Error('no contract abi, error in contract address');
  }
  const rosettaContract = new Contract(
    contractAbi,
    contractAddress,
    starknetProvider
  );

  // Interaction with the contract with call
  const starknetAddress =
    await rosettaContract.get_starknet_address_with_fallback(address);
  return '0x' + starknetAddress.toString(16);
}

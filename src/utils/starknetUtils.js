import { RpcProvider, Contract } from 'starknet';

export async function getStarknetAddress(address) {
  const starknetProvider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
  });

  const contractAddress =
    '0x065a6238502254a31072c53bedf5046cbb626ce49cd49ba20e206b35d5aed0ad';

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

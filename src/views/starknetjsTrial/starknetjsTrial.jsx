import React, { useState } from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  useToast,
  Button,
  Code,
  Stack,
  Link,
  Divider,
  Card,
  CardBody,
  Input,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { getStarknetAddress } from '../../utils/starknetUtils';
import { CodeBlock, dracula } from 'react-code-blocks';
import { ENDURLST_ABI } from './endurLSTABI.js';
import { connect } from '@starknet-io/get-starknet';
import { Contract, WalletAccount, cairo } from 'starknet';
// import { RosettanetAccount } from 'starknet';
import { RosettanetAccount } from 'rosettanet-starknetjs-impl';
import { asciiToHex } from '../../utils/asciiToHex';
import { prepareMulticallCalldata } from 'rosettanet';

const snTx = {
  type: 'INVOKE_FUNCTION',
  contractAddress:
    '0x0239d830fcff445b380b53473e8907cb32bfd8fe68579a76a4014382f931e2b1',
  calldata: [
    '0x2',
    '0xaa79a8e98e1c8fac6fe4dd0e677d01bf1ca5f419',
    '0x1',
    '0x98af802404e21',
    '0x98af802404e21',
    '0x0',
    '0x5208',
    '0xde0b6b3a7640000',
    '0x0',
    '0x0',
  ],
  version: '0x3',
  signature: [
    '0x88552c4d654b9f2270d022ed565f4ada',
    '0x3d481d75612b44edf05122ea41e019bf',
    '0x159b964f5040b54abd479f852b185bf3',
    '0x41ee1fa020cde5ade8cb8e394603c0ce',
    '0x1b',
    '0xde0b6b3a7640000',
    '0x0',
  ],
  nonce: '0xb',
  max_fee: '0x0',
  resourceBounds: {
    l1_gas: {
      max_amount: '0x5280',
      max_price_per_unit: '0x5280',
    },
    l2_gas: {
      max_amount: '0x0',
      max_price_per_unit: '0x0',
    },
  },
  tip: '0x0',
  paymasterData: [],
  accountDeploymentData: [],
  nonceDataAvailabilityMode: 'L1',
  feeDataAvailabilityMode: 'L1',
};

const node = 'https://rosettanet.onrender.com/';
const nodeStrk = 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7';

// https://alpha-deployment.rosettanet.io
// http://localhost:3000/

export default function StarknetjsTrial() {
  const [walletName, setWalletName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [executeResult, setExecuteResult] = useState('');
  const [endurResult, setEndurResult] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [contractSalt, setContractSalt] = useState('');
  const [loading, setLoading] = useState(false);
  const [callMethodResults, setCallMethodResults] = useState({
    blockNumber: '',
    chainId: '',
    estimateGas: '',
    gasPrice: '',
    getBalance: '',
    getBlockByHash: '',
    getBlockByNumber: '',
    getBlockTransactionCountByHash: '',
    getBlockTransactionCountByNumber: '',
    getCode: '',
    getTransactionHashByBlockHashAndIndex: '',
    getTransactionHashByBlockNumberAndIndex: '',
    getTransactionByHash: '',
    getTransactionCount: '',
    getTransactionReceipt: '',
    permissions: '',
  });

  const [starknetCallMethodResults, setStarknetCallMethodResults] = useState({
    chainId: '',
    blockNumber: '',
    getBlockLatestAccepted: '',
    getSpecVersion: '',
    getNonceForAddress: '',
    getBlockWithTxHashes: '',
    getBlockWithTxs: '',
    getBlockWithReceipts: '',
    getBlockStateUpdate: '',
    getBlockTransactionsTraces: '',
    getBlockTransactionCount: '',
    getTransactionByHash: '',
    getTransactionByBlockIdAndIndex: '',
    getTransactionReceipt: '',
    getTransactionTrace: '',
    getTransactionStatus: '',
    simulateTransaction: '',
    getClassHashAt: '',
    getClass: '',
    getClassAt: '',
    getInvokeEstimateFee: '',
  });

  const toast = useToast();

  function handleConnect() {
    return async () => {
      const res = await connect({ modalMode: 'alwaysAsk' });
      console.log(res);
      setWalletName(res?.name || '');
      setSelectedAccount(res);
    };
  }

  async function getRosettanetCallMethods() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        { nodeUrl: node },
        selectedAccount
      );
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    const tx = {
      from: rAccount.address,
      to: rAccount.address,
      value: '0x9184e72a',
    };

    if (rAccount) {
      try {
        await rAccount.blockNumberRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            blockNumber: parseInt(res, 16),
          }));
        });

        await rAccount.chainIdRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            chainId: res,
          }));
        });

        // await rAccount.getPermissionsRosettanet().then((res) => {
        //   console.log(res);
        //   setCallMethodResults((prev) => ({
        //     ...prev,
        //     permissions: res,
        //   }));
        // });

        await rAccount.estimateGasRosettanet(tx).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            estimateGas: res,
          }));
        });

        await rAccount.gasPriceRosettanet().then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            gasPrice: res,
          }));
        });

        await rAccount.getBalanceRosettanet(rAccount.address).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getBalance: res,
          }));
        });

        await rAccount
          .getBlockByHashRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockByHash: res,
            }));
          });

        await rAccount.getBlockByNumberRosettanet('0x123').then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getBlockByNumber: res,
          }));
        });

        await rAccount
          .getBlockTransactionCountByHashRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockTransactionCountByHash: res,
            }));
          });

        await rAccount
          .getBlockTransactionCountByNumberRosettanet('0x123')
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getBlockTransactionCountByNumber: res,
            }));
          });

        await rAccount.getCodeRosettanet(rAccount.address).then(res => {
          console.log(res);
          setCallMethodResults(prev => ({
            ...prev,
            getCode: res,
          }));
        });

        await rAccount
          .getTransactionHashByBlockHashAndIndexRosettanet(
            '0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7',
            1
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionHashByBlockHashAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionHashByBlockNumberAndIndexRosettanet('0x123', 1)
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionHashByBlockNumberAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionByHashRosettanet(
            '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionByHash: res,
            }));
          });

        await rAccount
          .getTransactionCountRosettanet(rAccount.address)
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionCount: res,
            }));
          });

        await rAccount
          .getTransactionReceiptRosettanet(
            '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
          )
          .then(res => {
            console.log(res);
            setCallMethodResults(prev => ({
              ...prev,
              getTransactionReceipt: res,
            }));
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function getStarknetJSCallMethods() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: node }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    try {
      const snAddress = await (typeof selectedAccount.sendAsync ===
        'function' && typeof selectedAccount.send === 'function'
        ? getStarknetAddress(rAccount.address)
        : rAccount.address);

      await rAccount.getChainId().then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          chainId: res,
        }));
      });

      await rAccount.getBlockNumber().then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          blockNumber: res,
        }));
      });

      await rAccount.getBlockLatestAccepted().then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockLatestAccepted: res,
        }));
      });

      await rAccount.getSpecVersion().then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getSpecVersion: res,
        }));
      });

      await rAccount.getNonceForAddress(snAddress).then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getNonceForAddress: res,
        }));
      });

      await rAccount.getBlockWithTxHashes('latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockWithTxHashes: res,
        }));
      });

      await rAccount.getBlockWithTxs('latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockWithTxs: res,
        }));
      });

      await rAccount.getBlockWithReceipts('latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockWithReceipts: res,
        }));
      });

      await rAccount.getBlockStateUpdate('latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockStateUpdate: res,
        }));
      });

      await rAccount.getBlockTransactionsTraces().then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockTransactionsTraces: res,
        }));
      });

      await rAccount.getBlockTransactionCount('latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getBlockTransactionCount: res,
        }));
      });

      await rAccount
        .getTransactionByHash(
          '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
        )
        .then(res => {
          console.log(res);
          setStarknetCallMethodResults(prev => ({
            ...prev,
            getTransactionByHash: res,
          }));
        });

      await rAccount.getTransactionByBlockIdAndIndex('latest', 1).then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getTransactionByBlockIdAndIndex: res,
        }));
      });

      await rAccount
        .getTransactionReceipt(
          '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
        )
        .then(res => {
          console.log(res);
          setStarknetCallMethodResults(prev => ({
            ...prev,
            getTransactionReceipt: res,
          }));
        });

      await rAccount
        .getTransactionTrace(
          '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
        )
        .then(res => {
          console.log(res);
          setStarknetCallMethodResults(prev => ({
            ...prev,
            getTransactionTrace: res,
          }));
        });

      await rAccount
        .getTransactionStatus(
          '0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a'
        )
        .then(res => {
          console.log(res);
          setStarknetCallMethodResults(prev => ({
            ...prev,
            getTransactionStatus: res,
          }));
        });

      //! HATA VAR GETCLASSAT İSTEĞİ GÖNDERİYOR FAKAT GÖNDERİRKEN ETH ADRESİNİ GÖNDERİYOR
      //! SN ADDRESS OLMADIĞI İÇİN HATA VERİYOR.
      // await rAccount
      //   .simulateTransaction(snTx, {
      //     skipFeeCharge: true,
      //     skipValidate: true,
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     setStarknetCallMethodResults((prev) => ({
      //       ...prev,
      //       simulateTransaction: res,
      //     }));
      //   });

      await rAccount.getClassHashAt(snAddress, 'latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getClassHashAt: res,
        }));
      });

      await rAccount
        .getClass(
          '0x04b7ccebfb848b8d8e62808718de698afcb529b36885c2927ae4fbafc5a18a81'
        )
        .then(res => {
          console.log(res);
          setStarknetCallMethodResults(prev => ({
            ...prev,
            getClass: res,
          }));
        });

      await rAccount.getClassAt(snAddress, 'latest').then(res => {
        console.log(res);
        setStarknetCallMethodResults(prev => ({
          ...prev,
          getClassAt: res,
        }));
      });

      await rAccount.getInvokeEstimateFee(snTx).then(res => {
        console.log(res);
        const result = {
          data_gas_consumed: res.data_gas_consumed.toString(),
          data_gas_price: res.data_gas_price.toString(),
          gas_consumed: res.gas_consumed.toString(),
          gas_price: res.gas_price.toString(),
          overall_fee: res.overall_fee.toString(),
          resourceBounds: {
            l1_gas: {
              max_amount: res.resourceBounds.l1_gas.max_amount.toString(),
              max_price_per_unit:
                res.resourceBounds.l1_gas.max_price_per_unit.toString(),
            },
            l2_gas: {
              max_amount: res.resourceBounds.l2_gas.max_amount.toString(),
              max_price_per_unit:
                res.resourceBounds.l2_gas.max_price_per_unit.toString(),
            },
          },
          suggestedMaxFee: res.suggestedMaxFee.toString(),
          unit: res.unit,
        };

        setStarknetCallMethodResults(prev => ({
          ...prev,
          getInvokeEstimateFee: result,
        }));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function signMessage() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    const msgParams = JSON.stringify({
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1381192787,
        // Give a user-friendly name to the specific contract you're signing for.
        name: 'Ether Mail',
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // This identifies the latest version.
        version: '1',
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: 'Mail',
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to primaryType.
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    });

    if (rAccount) {
      try {
        // await rAccount.walletProvider
        //   .request({
        //     method: "eth_signTypedData_v4",
        //     params: [rAccount.address, msgParams],
        //   })
        //   .then((res) => {
        //     console.log(res);
        //   });

        await rAccount.signMessage(msgParams, rAccount.address).then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function sendTransaction() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      const unsignedTx = {
        to: '0x1e495b498736bBa9d2CbE8dabA652058d46B2d5a',
        value: '0xDE0B6B3A7640000',
        from: rAccount.address,
        data: '0x',
      };
      try {
        await rAccount.sendTransactionRosettanet(unsignedTx).then(res => {
          console.log(res);
          setTransactions(prevData => [...prevData, res]);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function Avnu() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      const snAddress = await (typeof selectedAccount.sendAsync ===
        'function' && typeof selectedAccount.send === 'function'
        ? getStarknetAddress(rAccount.address)
        : rAccount.address);

      const getQuotes = await fetch(
        'https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000'
      );
      const getQuotesResponse = await getQuotes.json();
      const quoteId = getQuotesResponse[0].quoteId;

      const postBody = {
        quoteId: quoteId,
        takerAddress: snAddress,
        slippage: '0.05',
        includeApprove: true,
      };

      const buildSwapData = await fetch(
        'https://sepolia.api.avnu.fi/swap/v2/build',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        }
      );

      const buildSwapDataResponse = await buildSwapData.json();

      const calldataDecoded = [
        {
          contract_address:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          entry_point:
            '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
          calldata: buildSwapDataResponse.calls[0].calldata,
        },
        {
          contract_address:
            '0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2',
          entry_point:
            '0x01171593aa5bdadda4d6b0efde6cc94ee7649c3163d5efeb19da6c16d63a2a63',
          calldata: buildSwapDataResponse.calls[1].calldata,
        },
      ];

      const unsignedTx = {
        from: rAccount.address,
        to: '0x0000000000000000000000004645415455524553',
        data: prepareMulticallCalldata(calldataDecoded),
        value: '0x0',
      };

      try {
        console.log('transaction object', unsignedTx);

        await rAccount.sendTransactionRosettanet(unsignedTx).then(res => {
          console.log(res);
          setTransactions(prevData => [...prevData, res]);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function changetoRosettanet() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      try {
        await rAccount.switchStarknetChain('0x52535453').then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function execute() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      try {
        const snAddress = await (typeof selectedAccount.sendAsync ===
          'function' && typeof selectedAccount.send === 'function'
          ? getStarknetAddress(rAccount.address)
          : rAccount.address);

        const getQuotes = await fetch(
          'https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000'
        );
        const getQuotesResponse = await getQuotes.json();
        const quoteId = getQuotesResponse[0].quoteId;

        const postBody = {
          quoteId: quoteId,
          takerAddress: snAddress,
          slippage: '0.05',
          includeApprove: true,
        };

        const buildSwapData = await fetch(
          'https://sepolia.api.avnu.fi/swap/v2/build',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postBody),
          }
        );

        const buildSwapDataResponse = await buildSwapData.json();

        const calldataDecoded = [
          {
            contractAddress:
              '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            entrypoint: 'approve',
            calldata: buildSwapDataResponse.calls[0].calldata,
          },
          {
            contractAddress:
              '0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2',
            entrypoint: 'multi_route_swap',
            calldata: buildSwapDataResponse.calls[1].calldata,
          },
        ];
        console.log('calldata', calldataDecoded);

        await rAccount.execute(calldataDecoded).then(res => {
          console.log(res);
          setExecuteResult(res.transaction_hash);
          setTransactions(prevData => [...prevData, res.transaction_hash]);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function declare() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      try {
        await rAccount.declare().then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function deploy() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      try {
        await rAccount.deploy().then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function getPermission() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    if (rAccount) {
      try {
        await rAccount.getPermissions().then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function getEndurWithContractCall() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    if (rAccount) {
      const lstContract = new Contract(
        ENDURLST_ABI,
        '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
        rAccount
      );

      const lstStake = await lstContract.asset();

      console.log('0x' + new BigNumber(lstStake).toString(16));
      const res = '0x' + new BigNumber(lstStake).toString(16);
      setEndurResult(res);
    }
  }

  const unruggableExecute = async e => {
    e.preventDefault();

    setLoading(true);
    let rAccount;
    if (selectedAccount) {
      rAccount = await (typeof selectedAccount.sendAsync === 'function' &&
      typeof selectedAccount.send === 'function'
        ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
        : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount));
    } else {
      toast({
        title: 'Disconnect from left menu and connect with get-starknet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
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

    const snAddress = await (typeof selectedAccount.sendAsync === 'function' &&
    typeof selectedAccount.send === 'function'
      ? getStarknetAddress(rAccount.address)
      : rAccount.address);

    const createMemecoinCalldata = [
      {
        contractAddress:
          '0x00494a72a742b7880725a965ee487d937fa6d08a94ba4eb9e29dd0663bc653a2',
        entrypoint:
          '0x014b9c006653b96dd1312a62b5921c465d08352de1546550f0ed804fcc0ef9e9',
        calldata: [
          snAddress,
          '0x' + asciiToHex(tokenName),
          '0x' + asciiToHex(tokenSymbol),
          '0x' + initialSupplyUint256.low.toString(16),
          '0x' + initialSupplyUint256.high.toString(16),
          '0x' + asciiToHex(contractSalt),
        ],
      },
    ];

    try {
      await rAccount.execute(createMemecoinCalldata).then(res => {
        console.log(res);
        setExecuteResult(res.transaction_hash);
        setTransactions(prevData => [...prevData, res.transaction_hash]);
      });
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

  const code1 = `let rAccount;
    if (selectedAccount) {
      rAccount = await (
        typeof selectedAccount.sendAsync === 'function' && typeof selectedAccount.send === 'function'
          ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
          : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount)
      );
    }
      
    await rAccount.execute(starknetCalldata).then(res => {
    console.log(res);
    });`;

  const code2 = ` async function getEndurWithContractCall() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (
        typeof selectedAccount.sendAsync === 'function' && typeof selectedAccount.send === 'function'
          ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
          : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount)
      );
    }

    if (rAccount) {
      const lstContract = new Contract(
        ENDURLST_ABI,
        '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb', // LST Contract Address
        rAccount
      );

      const lstStake = await lstContract.asset();

      console.log('0x' + new BigNumber(lstStake).toString(16));
    }
  }
`;

  return (
    <Container maxW="3xl" overflow={'hidden'}>
      <Heading as="h3" size="lg" my={4}>
        Connect With Starknet.js
      </Heading>
      <Text as="cite" fontSize={'sm'}>
        This part you can connect to Starknet with using Starknet.js and
        get-starknet. It will connect with MetaMask for now. Supports both
        Starknet and Ethereum requests. Both Metamask and Metamask Snaps will be
        in modal. Metamask Normal is the one added.
      </Text>
      <Text as="cite" fontSize={'sm'} display={'block'} mt={2}>
        If your wallet is connected before this page, please disconnect it from
        left side. If not there will be an error.
      </Text>
      <Box width="100%" flexWrap={'wrap'} my={4} gap={4} display="flex">
        <Button onClick={handleConnect()}>Connect With get-starknet</Button>
        <Button onClick={changetoRosettanet}>
          Change Network to Rosettanet
        </Button>
        <Button onClick={getRosettanetCallMethods}>
          Get Rosettanet Call Methods
        </Button>
        <Button onClick={getStarknetJSCallMethods}>
          Get StarknetJS Call Methods
        </Button>
        <Button onClick={signMessage}>Sign Message</Button>
        <Button onClick={sendTransaction}>Send 1 STRK</Button>
        <Button onClick={Avnu}>
          Avnu With sendTransactionRosettanet() method
        </Button>
        <Button onClick={getPermission}>Get permissions</Button>
        <Button onClick={declare}>Declare</Button>
        <Button onClick={deploy}>Deploy</Button>
        <Button onClick={execute}>Execute</Button>
        <Button onClick={getEndurWithContractCall}>
          Get Endur with Contract Call
        </Button>
      </Box>
      <form onSubmit={unruggableExecute} style={{ marginTop: '1rem' }}>
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
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
      <Text>Wallet Name : {walletName}</Text>
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
      <Box>
        <Text>
          Execute Function Result:
          <Link
            fontSize={'sm'}
            href={`https://sepolia.voyager.online/tx/${executeResult}`}
            isExternal
          >
            {executeResult}
          </Link>
        </Text>
        <Text>Declare Function Result: Not Available in Rosettanet</Text>
        <Text>Deploy Function Result: Not Available in Rosettanet</Text>
        <Text>
          Endur LST Contract Call (read call asset()) Result : {endurResult}
        </Text>
      </Box>
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
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
      <Box>
        <Text fontSize="lg" as="b">
          StarknetJS Wallet Account Methods
        </Text>
        <Text mt={3} mb={3}>
          We can use <Code>execute</Code> method same with StarknetJS's wallet
          account. Sending starknet calldata as parameters is enough.
        </Text>
        <Box my={4}>
          <Text as="b">Example 1 Execute Method</Text>
          <CodeBlock
            text={code1}
            language={'javascript'}
            showLineNumbers={true}
            startingLineNumber={1}
            theme={dracula}
          />
        </Box>
        <Box my={4}>
          <Text as="b">Example 2 Contract Call</Text>
          <CodeBlock
            text={code2}
            language={'javascript'}
            showLineNumbers={true}
            startingLineNumber={1}
            theme={dracula}
          />
        </Box>
      </Box>
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
      <Stack flexDirection={'row'} flexWrap={'wrap'}>
        <Box>
          <Text>Rosettanet Call Methods :</Text>
          <Code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(callMethodResults, null, 2)}
          </Code>
        </Box>
        <Box>
          <Text>StarknetJS Call Methods :</Text>
          <Code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(starknetCallMethodResults, null, 2)}
          </Code>
        </Box>
      </Stack>
    </Container>
  );
}

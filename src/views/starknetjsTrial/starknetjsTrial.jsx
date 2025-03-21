import React, { useState } from 'react';
import { Contract, RosettanetAccount, cairo } from 'starknet';
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
} from '@chakra-ui/react';
import { parseEther, AbiCoder } from 'ethers';
import BigNumber from 'bignumber.js';
import { getStarknetAddress } from '../../utils/starknetUtils';
import { CodeBlock, dracula } from 'react-code-blocks';
import { ENDURLST_ABI } from './endurLSTABI.js';
import { connect } from '@starknet-io/get-starknet';

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

const node = 'http://localhost:3000';

// http://localhost:3000

export default function StarknetjsTrial() {
  const [walletName, setWalletName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [executeResult, setExecuteResult] = useState('');
  const [endurResult, setEndurResult] = useState('');
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
      const res = await connect();
      console.log(res);
      setWalletName(res?.name || '');
      setSelectedAccount(res);
    };
  }

  async function getRosettanetCallMethods() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
    try {
      const snAddress = await getStarknetAddress(rAccount.address);

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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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

    if (rAccount) {
      const unsignedTx = {
        to: '0xaa79a8e98e1C8Fac6Fe4DD0e677d01BF1CA5f419',
        value: '0xDE0B6B3A7640000',
        from: rAccount.address,
        data: '0x',
      };
      try {
        await rAccount.sendTransactionRosettanet(unsignedTx).then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function xStrk() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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

    if (rAccount) {
      const snAddress = await getStarknetAddress(rAccount.address);
      const starkAmount = cairo.uint256(parseEther('1'));

      const encoder = new AbiCoder();

      const calldataDecoded = [
        [
          [
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
            [
              '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
              '0x' + new BigNumber(starkAmount.low).toString(16),
              '0x' + new BigNumber(starkAmount.high).toString(16),
            ],
          ],
          [
            '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
            '0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01',
            [
              '0x' + new BigNumber(starkAmount.low).toString(16),
              '0x' + new BigNumber(starkAmount.high).toString(16),
              snAddress,
            ],
          ],
        ],
      ];

      const calldataEncoded = encoder.encode(
        ['tuple(uint256,uint256,uint256[])[]'],
        calldataDecoded
      );

      const calldata = '0x76971d7f' + calldataEncoded.replace('0x', '');

      const unsignedTx = {
        from: rAccount.address,
        to: rAccount.address,
        data: calldata,
        value: '0x0',
      };

      try {
        console.log('transaction object', unsignedTx);

        await rAccount.sendTransactionRosettanet(unsignedTx).then(res => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function changetoRosettanet() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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

    if (rAccount) {
      try {
        await rAccount.switchChainRosettanet().then(res => {
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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

    if (rAccount) {
      try {
        const snAddress = await getStarknetAddress(rAccount.address);
        const starkAmount = cairo.uint256(parseEther('1'));

        const calldataDecoded = [
          {
            contractAddress:
              '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            entrypoint:
              '0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
            calldata: [
              '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
              '0x' + new BigNumber(starkAmount.low).toString(16),
              '0x' + new BigNumber(starkAmount.high).toString(16),
            ],
          },
          {
            contractAddress:
              '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
            entrypoint:
              '0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01',
            calldata: [
              '0x' + new BigNumber(starkAmount.low).toString(16),
              '0x' + new BigNumber(starkAmount.high).toString(16),
              snAddress,
            ],
          },
        ];
        await rAccount.execute(calldataDecoded).then(res => {
          console.log(res);
          setExecuteResult(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function declare() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
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

    if (rAccount) {
      const lstContract = new Contract(
        ENDURLST_ABI,
        '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
        rAccount
      );

      const lstStake = await lstContract.asset();

      console.log('0x' + new BigNumber(lstStake).toString(16));
      setEndurResult('0x' + new BigNumber(lstStake).toString(16));
    }
  }

  const code1 = `let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
        selectedAccount
      );
    }
      
    await rAccount.execute(starknetCalldata).then(res => {
    console.log(res);
    });`;

  const code2 = ` async function getEndurWithContractCall() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: node,
        },
        selectedAccount
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
        <Button onClick={xStrk}>xSTRK</Button>
        <Button onClick={getPermission}>Get permissions</Button>
        <Button onClick={declare}>Declare</Button>
        <Button onClick={deploy}>Deploy</Button>
        <Button onClick={execute}>Execute</Button>
        <Button onClick={getEndurWithContractCall}>
          Get Endur with Contract Call
        </Button>
      </Box>
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
      <Text>Wallet Name : {walletName}</Text>
      <Divider mt={10} mb={10} style={{ borderColor: 'black' }} />
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

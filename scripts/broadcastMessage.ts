import { ethers } from 'hardhat';
require('dotenv').config();

async function main() {
  // Load RPC URLs
  const rpcSepolia = process.env.RPC_SEPOLIA;

  // Load private keys from .env file
  const privateKeyFuji = process.env.PRIVATE_KEY_SEPOLIA;
  if (privateKeyFuji == null) {
    return
  }

  // Create providers
  const providerFuji = new ethers.providers.JsonRpcProvider(rpcSepolia);

  // Create wallets
  const walletFuji = new ethers.Wallet(privateKeyFuji, providerFuji);

  // Input your contract's deployed address here
  const multiPassContractAddress = "<Your-Contract-Address>";

  const chainIdsEndpointsLayerZero = [
    { chainName: "Arbitrum-Goerli", chainId: "10143", endpoint: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab" },
    { chainName: "Optimism-Goerli", chainId: "10132", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "Mumbai", chainId: "10109", endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" },
    { chainName: "Sepolia", chainId: "10161", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "Fuji Testnet", chainId: "10106", endpoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706" },
    { chainName: "gnosis Testnet", chainId: "10145", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "zkSync Testnet", chainId: "10165", endpoint: "0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281" },


  ];

  // Create contract instance

  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_omniTicketContract",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_endpoint",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "NFTOwnershipBroadcasted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_dstChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes",
          "name": "_destination",
          "type": "bytes"
        }
      ],
      "name": "broadcastNFTOwnership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "broadcastedNftsTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_dstChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes",
          "name": "_destination",
          "type": "bytes"
        }
      ],
      "name": "checkFees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "endpoint",
      "outputs": [
        {
          "internalType": "contract ILayerZeroEndpoint",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "layerZeroContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_srcChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes",
          "name": "_srcAddress",
          "type": "bytes"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "bytes",
          "name": "_payload",
          "type": "bytes"
        }
      ],
      "name": "lzReceive",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ownerToVerify",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_srcChainId",
          "type": "uint16"
        }
      ],
      "name": "multiPassCheck",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "omniNftsSent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "omniTicketContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const multiPassContract = new ethers.Contract(multiPassContractAddress, abi, walletFuji);

  // Get your dstChainId and _destinationContract
  const dstChainId = chainIdsEndpointsLayerZero[2].chainId;
  let _destinationContract = ethers.utils.arrayify("0xB00b6e2135a76C8195F3BFC516e805a9fC59a143");

  let address = "0xB00b6e2135a76C8195F3BFC516e805a9fC59a143";
  let bytes = ethers.utils.arrayify(address);

  console.log(bytes);
  // Check the fees
  //let feeNeeded = await multiPassContract.checkFees(dstChainId, _destinationContract, { from: walletFuji.address });

  // Broadcast NFT Ownership
  // let broadcastedNftOwnership = await multiPassContract.broadcastNFTOwnership(dstChainId, _destinationContract, { value: 5000, from: walletFuji.address });

  // console.log(`Broadcasted nftOwnership txhash: ${broadcastedNftOwnership.txhash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



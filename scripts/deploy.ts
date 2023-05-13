import { ethers } from "hardhat";
require('dotenv').config();


async function main() {


  console.log(`Starting deployment V1`)


  const uri = "http://www.voodoofx.com/wp-content/uploads/2018/03/Multipass-LeeLoo.jpg";
  const chainIdsEndpointsLayerZero = [
    { chainName: "Arbitrum-Goerli", chainId: "10143", endpoint: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab" },
    { chainName: "Optimism-Goerli", chainId: "10132", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "Mumbai", chainId: "10109", endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" },
    { chainName: "Sepolia", chainId: "10161", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "Fuji Testnet", chainId: "10106", endpoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706" },
    { chainName: "gnosis Testnet", chainId: "10145", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "zkSync Testnet", chainId: "10165", endpoint: "0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281" },
    { chainName: "polygon mainnet", chainId: "109", endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62" },

  ];


  // Load private keys from .env file
  const privateKeyMumbai = process.env.PRIVATE_KEY_MUMBAI;
  const privateKeySepolia = process.env.PRIVATE_KEY_SEPOLIA;

  // Load RPC URLs
  const rpcMumbai = process.env.RPC_MUMBAI;
  const rpcSepolia = process.env.RPC_SEPOLIA;

  // Create providers
  const providerMumbai = new ethers.providers.JsonRpcProvider(rpcMumbai);
  const providerSepolia = new ethers.providers.JsonRpcProvider(rpcSepolia);
  const providerFuji = new ethers.providers.JsonRpcProvider(process.env.RPC_FUJI);

  // Create wallets
  const walletMumbai = new ethers.Wallet(privateKeyMumbai!, providerMumbai);

  const walletFuji = new ethers.Wallet(privateKeyMumbai!, providerFuji);
  const walletSepolia = new ethers.Wallet(privateKeySepolia!, providerSepolia);


  //@TODO This has to be deployed on SEPOLIA
  const SMultiPassContract = await ethers.getContractFactory("MultiPassContract", walletSepolia);
  const SMultichainTicket = await ethers.getContractFactory("MultichainTicket", walletSepolia);


  const SmultichainTicket = await SMultichainTicket.deploy(uri);
  await SmultichainTicket.deployed();

  const SmultiPassContract = await SMultiPassContract.deploy(SmultichainTicket.address, chainIdsEndpointsLayerZero[3].endpoint);
  await SmultiPassContract.deployed();


  await SmultichainTicket.mint()

  console.log(`Deployed Contracts to Chain:  ${chainIdsEndpointsLayerZero[3].chainName}`)
  console.log(
    `Deployed multiPassContract to ${SmultiPassContract.address}`
  );

  console.log(
    `Deployed multichainTicket to ${SmultichainTicket.address}`
  );

  //done with sepolia

  // we want to receive on mumbai. What do we do.

  const MultiPassContract = await ethers.getContractFactory("MultiPassContract", walletMumbai);
  const MultichainTicket = await ethers.getContractFactory("MultichainTicket", walletMumbai);


  const multichainTicket = await SMultichainTicket.deploy(uri);
  await multichainTicket.deployed();

  const multiPassContract = await SMultiPassContract.deploy(SmultiPassContract.address, chainIdsEndpointsLayerZero[7].endpoint);
  await multiPassContract.deployed();




  console.log(`Deployed Contracts to Chain:  ${chainIdsEndpointsLayerZero[7].chainName}`)
  console.log(
    `Deployed multiPassContract to ${multiPassContract.address}`
  );

  console.log(
    `Deployed multichainTicket to ${multichainTicket.address}`
  );






  //destination receiver

  /*
  const dstChainId = chainIdsEndpointsLayerZero[4].chainId;
  const _destinationContract = multiPassContract.address; // has to be already deployed on the other chain

  let feeNeeded = await multiPassContract.checkFees(dstChainId, _destinationContract, { from: walletFuji.address });

  let broadcastedNftOwnership = await multiPassContract.broadcastNFTOwnership(dstChainId, _destinationContract, { value: feeNeeded, from: walletFuji.address })


   console.log(
    `Broadcasted nftOwnership txhash:  ${broadcastedNftOwnership} `

  )


  */









}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

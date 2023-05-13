import { ethers } from "hardhat";
require('dotenv').config();


async function main() {


  console.log(`Starting deployment V1`)


  const uri = "http://www.voodoofx.com/wp-content/uploads/2018/03/Multipass-LeeLoo.jpg";
  const chainIdsEndpointsLayerZero = [
    { chainName: "Arbitrum-Goerli", chainId: "10143", endpoint: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab" },
    { chainName: "Optimism-Goerli", chainId: "10132", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" },
    { chainName: "Mumbai", chainId: "10109", endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" },
    { chainName: "Sepolia", chainId: "10161", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" }
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

  // Create wallets
  const walletMumbai = new ethers.Wallet(privateKeyMumbai!, providerMumbai);
  const walletSepolia = new ethers.Wallet(privateKeySepolia!, providerSepolia);



  //first test on sepolia to mumbai

  //@TODO this has to be deployed on MUMBAI

  const MultiPassContract = await ethers.getContractFactory("MultiPassContract", walletMumbai);
  const MultichainTicket = await ethers.getContractFactory("MultichainTicket", walletMumbai);


  const multichainTicket = await MultichainTicket.deploy(uri);
  await multichainTicket.deployed();

  const multiPassContract = await MultiPassContract.deploy(multichainTicket.address, chainIdsEndpointsLayerZero[2].endpoint);
  await multiPassContract.deployed();


  await multichainTicket.mint()

  console.log(`Mumbai done`)

  //@TODO This has to be deployed on SEPOLIA
  const SMultiPassContract = await ethers.getContractFactory("MultiPassContract", walletSepolia);
  const SMultichainTicket = await ethers.getContractFactory("MultichainTicket", walletSepolia);


  const SmultichainTicket = await SMultichainTicket.deploy(uri);
  await SmultichainTicket.deployed();

  const SmultiPassContract = await SMultiPassContract.deploy(SmultichainTicket.address, chainIdsEndpointsLayerZero[3].endpoint);
  await SmultiPassContract.deployed();


  await SmultichainTicket.mint()


  console.log(`Sepolia done`)

  const dstChainId = chainIdsEndpointsLayerZero[2].chainId;
  const _destinationContract = multiPassContract.address; // has to be already deployed on the other chain

  let feeNeeded = await multiPassContract.checkFees(dstChainId, _destinationContract, { from: walletMumbai.address });

  let broadcastedNftOwnership = await multiPassContract.broadcastNFTOwnership(dstChainId, _destinationContract, { value: feeNeeded, from: walletMumbai.address })





  console.log(`Deployed Contracts to Chain:  ${chainIdsEndpointsLayerZero[2].chainName}`)
  console.log(
    `Deployed multiPassContract to ${multiPassContract.address}`
  );

  console.log(
    `Deployed multichainTicket to ${multichainTicket.address}`
  );

  console.log(`Deployed Contracts to Chain:  ${chainIdsEndpointsLayerZero[3].chainName}`)
  console.log(
    `Deployed multiPassContract to ${SmultiPassContract.address}`
  );

  console.log(
    `Deployed multichainTicket to ${SmultichainTicket.address}`
  );

  console.log(
    `Broadcasted nftOwnership txhash:  ${broadcastedNftOwnership} `

  )




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

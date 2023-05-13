import { ethers } from "hardhat";

async function main() {

  const uri = "http://www.voodoofx.com/wp-content/uploads/2018/03/Multipass-LeeLoo.jpg";
  const chainIdsEndpointsLayerZero = [{ chainName: "Arbitrum-Goerli", chainId: "10143", endpoint: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab" }, { chainName: "Optimism-Goerli", chainId: "10132", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" }, { chainName: "Mumbai", chainId: "10109", endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" }, { chainName: "Sepolia", chainId: "10161", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" }]


  //first test on sepolia to mumbai

  //@TODO this has to be deployed on MUMBAI

  const MultiPassContract = await ethers.getContractFactory("MultiPassContract");
  const MultichainTicket = await ethers.getContractFactory("MultichainTicket");

  const multichainTicket = await MultichainTicket.deploy(uri);
  await multichainTicket.deployed();

  const multiPassContract = await MultiPassContract.deploy(multichainTicket.address, chainIdsEndpointsLayerZero[3].endpoint);
  await multiPassContract.deployed();


  await multichainTicket.mint()

  //@TODO This has to be deployed on SEPOLIA

  const SMultiPassContract = await ethers.getContractFactory("MultiPassContract");
  const SMultichainTicket = await ethers.getContractFactory("MultichainTicket");

  const SmultichainTicket = await MultichainTicket.deploy(uri);
  await multichainTicket.deployed();

  const SmultiPassContract = await MultiPassContract.deploy(multichainTicket.address, chainIdsEndpointsLayerZero[4].endpoint);
  await SmultiPassContract.deployed();


  await SmultichainTicket.mint()


  const dstChainId = chainIdsEndpointsLayerZero[3].chainId;
  const _destinationContract = multiPassContract.address; // has to be already deployed on the other chain

  let feeNeeded = await multiPassContract.checkFees(dstChainId, _destinationContract);

  await multiPassContract.broadcastNFTOwnership(dstChainId, _destinationContract, { value: feeNeeded })




  console.log(`Deployed Contracts to Chain:  ${chainIdsEndpointsLayerZero[4].chainName}`)
  console.log(
    `Deployed multiPassContract to ${multiPassContract.address}`
  );

  console.log(
    `Deployed multichainTicket to ${multichainTicket.address}`
  );




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

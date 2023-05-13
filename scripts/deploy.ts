import { ethers } from "hardhat";

async function main() {

  const MultiPassContract = await ethers.getContractFactory("MultiPassContract");





  const chainIdsEndpointsLayerZero = [{ chainName: "Arbitrum-Goerli", chainId: "10143", endpoint: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab" }, { chainName: "Optimism-Goerli", chainId: "10132", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" }, { chainName: "Mumbai", chainId: "10109", endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" }, { chainName: "Sepolia", chainId: "10161", endpoint: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1" }]

  const multiPassContract = await MultiPassContract.deploy();
  await multiPassContract.deployed();

  console.log(
    `Deployed to ${multiPassContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { storeNFTs } = require("../utils/uploadToNftStorage");
const FUND_AMOUNT = "10000000000000000000000";
const imagesPath = "./images/randomNft";
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // uploading  our meta data to an online server so it can pin and generate a node for us
  let tokenUris;
  if (process.env.UPLOAD_TO_NFTSTORAGE == "true") {
    tokenUris = await handleTokenURIs();
  }
  let vrfCoordinatorV2Address, subscriptionId;
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReciept = await tx.wait(1);
    subscriptionId = txReciept.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinator;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("-----------------------------");
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];
  const randomIpfsNft = await deploy("RandomIPFSNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(randomIpfsNft.address, args);
  }
  log("-----------------------------");
};

async function handleTokenURIs() {
  tokenUris = [];

  let responses = await storeNFTs(imagesPath);
  for (let i = 0; i < responses.length; i++) {
    tokenUris.push(`ipfs://${responses[i].ipnft}/metadata.json`);
  }

  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];

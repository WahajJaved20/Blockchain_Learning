const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log("------------------------");
  let priceFeed;
  if (developmentChains.includes(network.name)) {
    const aggregator = await ethers.getContract("MockV3Aggregator");
    priceFeed = aggregator.address;
  } else {
    priceFeed = networkConfig[chainId].priceFeed;
  }
  const lowSvg = await fs.readFileSync("./images/dynamicNft/frown.svg", {
    encoding: "utf8",
  });
  const highSvg = await fs.readFileSync("./images/dynamicNft/happy.svg", {
    encoding: "utf8",
  });
  args = [priceFeed, lowSvg, highSvg];
  const dynamicSvgNft = await deploy("DynamicSVGNFT", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(dynamicSvgNft.address, args);
  }
  log("-----------------------------");
};
module.exports.tags = ["all", "dynamicsvg", "main"];

// we are numbering this folder since yarn hardhat deploy will use deploy folder with ordered numbers
// function deployFunc() {
//   console.log("damn");
// }
// module.exports.default = deployFunc;

const { network } = require("hardhat");
const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
/* OR */

// module.exports = async (hre) => {
//   //pulling these exact variables from hardhat runtime environment
//   const { getNamedAccounts, deployments } = hre;
// };

/* OR */

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // to use chains with localhost or hardhat, we need mocks
  let ethUsdPriceFeedAddress;
  if (developmentChain.includes(network.name)) {
    // if local
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const args = ethUsdPriceFeedAddress;
  // mocking => simulate the behavior of object as real life objects
  const fundMe = await deploy("FundMe", {
    from: deployer,
    // constructor arguments
    args: [args],
    log: true,
    contract: "FundMe",
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChain.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [args]);
  }
  log("------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];

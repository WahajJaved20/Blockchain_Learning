// a script determined to help with deploying mocks for local host and hardhat

const { network } = require("hardhat");
const { DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (network.config.chainId == 31337) {
    log("Local Host Network Detected, Deploying Mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks Deployed...");
    log("--------------------------------------");
  }
};
// we can run specific scripts with specific tags
module.exports.tags = ["all", "mocks"];

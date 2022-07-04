const { tasks, task } = require("hardhat/config");

// we are creating a task so we can run it with yarn hardhar
task("block-number", "prints the current block number").setAction(
  // hre allows us to use most of hardhat functions
  async (args, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block number : ${blockNumber}`);
  }
);

module.exports = {};

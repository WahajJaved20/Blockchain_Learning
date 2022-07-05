require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("./scripts/tasks/block-number.js");
require("hardhat-gas-reporter");
// this package helps us to simply compare our solidity code with tests to see
// if we missed any line unchecked for hack prevention
// run => YARN HARDHAT COVERAGE
require("solidity-coverage");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.ETHERSCAN_API_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    // we can start a network with yarn hardhat node to make a local host
    // then simple deploy script with localhost for fast asf results
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  defaultNetwork: "hardhat",
  solidity: "0.8.7",
  etherscan: {
    apiKey: API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
};

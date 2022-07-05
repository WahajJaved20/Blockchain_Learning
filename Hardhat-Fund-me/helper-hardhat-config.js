// a helper function to set the chain addresses depending on the network we are on

const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  31337: {
    name: "localhost",
  },
};
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000;
const developmentChain = ["hardhat", "localhost"];
module.exports = {
  networkConfig,
  developmentChain,
  DECIMALS,
  INITIAL_ANSWER,
};

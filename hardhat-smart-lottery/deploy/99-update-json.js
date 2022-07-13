const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONTEND_ADDRESSES_FILE =
  "../nextjs-lottery/constants/contractAddress.json";
const fRONTEND_ABI_FILE = "../nextjs-lottery/constants/abi.json";
// this file is to make a constants folder so our front end can easily get it
module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("here");
    updateContractAddress();
    updateABI();
  }
};

async function updateContractAddress() {
  const raffle = await ethers.getContract("Raffle");
  const chainId = network.config.chainId.toString();
  const currentAddress = JSON.parse(
    fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf8")
  );
  console.log(currentAddress);
  if (chainId in currentAddress) {
    if (!currentAddress[chainId].includes(raffle.address)) {
      currentAddress[chainId].push(raffle.address);
    }
  } else {
    currentAddress[chainId] = [raffle.address];
  }
  fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddress));
}

async function updateABI() {
  const raffle = await ethers.getContract("Raffle");
  fs.writeFileSync(
    fRONTEND_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json)
  );
}

module.exports.tags = ["all", "frontend"];

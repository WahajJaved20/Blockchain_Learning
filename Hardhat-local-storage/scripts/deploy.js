const { ethers, run, network } = require("hardhat");
async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying...");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();
  // === strictly equal
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(5);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value: ${currentValue}`);
  console.log("Updating ...");
  const response = await simpleStorage.store(7);
  await response.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value: ${updatedValue}`);
}

// creating a function to verify blocks
async function verify(contractAddress, args) {
  console.log("Verifying ... ");
  // run allows us to run any hardhat function
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// deploy script yarn hardhat run scripts/deploy.js

// hardhat has a predefined set node in the bg to run for us so we dont need
// http or private key

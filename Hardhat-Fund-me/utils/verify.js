// a simple function to verify the blockchain
const { run } = require("hardhat");
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
module.exports = { verify };

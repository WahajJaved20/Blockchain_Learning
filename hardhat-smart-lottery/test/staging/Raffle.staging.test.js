const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", function () {
      let raffle, raffleEntranceFee, deployer;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });
      describe("fulfill random words", function () {
        console.log("inside describe");
        it("words with live Chainlink Keepers and chainlink VRF, we get a random winner", async function () {
          console.log("inside it");
          const startingTimeStamp = await raffle.getLastTimeStamp();
          const accounts = await ethers.getSigners();
          console.log("entering promise");
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              try {
                console.log("entered try");
                const recentWinner = await raffle.getRecentWinner();
                console.log("winner picked");
                const raffleState = await raffle.getRaffleState();
                console.log("state recieved");
                const endingTimeStamp = await raffle.getLastTimeStamp();
                console.log(startingTimeStamp.toString());
                await expect(raffle.getPlayer(0)).to.be.reverted;
                console.log("asserting contract empty");
                assert.equal(recentWinner.toString(), accounts[0].address);
                console.log(endingTimeStamp.toString());
                assert.equal(raffleState, 0);
                console.log("asserting state");

                assert(endingTimeStamp > startingTimeStamp);
                console.log("asserting time");
                resolve();
                console.log("resolving");
              } catch (e) {
                reject(e);
              }
            });
            console.log("Enter raffle");
            const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
            await tx.wait(1);
            console.log("raffle Entered");
          });
        });
      });
    });

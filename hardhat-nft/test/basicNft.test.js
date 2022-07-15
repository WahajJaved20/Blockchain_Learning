const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BasicNFT", function () {
      let deployer;
      const chainId = network.config.chainId;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture();
        basicNft = await ethers.getContract("BasicNFT", deployer);
      });
      describe("constructor", function () {
        it("Tests if constructor is assigning proper value to token counter", async function () {
          const startingCounter = await basicNft.getTokenCounter();
          assert.equal(startingCounter, 0);
        });
      });
      describe("Mint NFT", function () {
        it("checks if the NFT Token is assigned to the right person", async function () {
          await basicNft.mintNFT();
          const newCounterValue = await basicNft.getTokenCounter();
          assert.equal(newCounterValue.toString(), 1);
          const NFTOwner = await basicNft.ownerOf(
            parseInt(newCounterValue) - 1
          );
          assert.equal(NFTOwner, deployer);
        });
      });
    });

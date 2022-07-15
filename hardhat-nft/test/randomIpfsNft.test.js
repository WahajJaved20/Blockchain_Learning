const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Random IPFS NFT", function () {
      let deployer, accounts, randomIpfsNft, vrfCoordinatorV2Mock;
      const chainId = network.config.chainId;
      beforeEach(async function () {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomipfs"]);
        randomIpfsNft = await ethers.getContract("RandomIPFSNFT", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
      });
      describe("constructor", () => {
        it("sets starting values correctly", async function () {
          const dogTokenUriZero = await randomIpfsNft.getDogTokenURIs(0);
          assert(dogTokenUriZero.includes("ipfs://"));
        });
      });

      describe("requestNft", () => {
        it("fails if payment isn't sent with the request", async function () {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            "NeedMoreETHSent"
          );
        });
        it("emits an event and kicks off a random word request", async function () {
          const fee = await randomIpfsNft.getMintFee();
          await expect(
            randomIpfsNft.requestNft({ value: fee.toString() })
          ).to.emit(randomIpfsNft, "NftRequested");
        });
      });
      describe("fulfillRandomWords", () => {
        it("mints NFT after random number is returned", async function () {
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once("NftMinted", async () => {
              try {
                const tokenUri = await randomIpfsNft.tokenURI("0");
                const tokenCounter = await randomIpfsNft.getTokenCounter();
                assert.equal(tokenUri.toString().includes("ipfs://"), true);
                assert.equal(tokenCounter.toString(), "1");
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });
            try {
              const fee = await randomIpfsNft.getMintFee();
              const requestNftResponse = await randomIpfsNft.requestNft({
                value: fee.toString(),
              });
              const requestNftReceipt = await requestNftResponse.wait(1);
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestNftReceipt.events[1].args.requestId,
                randomIpfsNft.address
              );
            } catch (e) {
              console.log(e);
              reject(e);
            }
          });
        });
      });
    });

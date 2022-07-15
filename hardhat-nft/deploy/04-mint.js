const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();
  const basicNft = await ethers.getContract("BasicNFT", deployer);
  const basicMintTx = await basicNft.mintNFT();
  await basicMintTx.wait(1);
  console.log(`BASIC NFT Index 0 has Token URI ${await basicNft.tokenURI(0)}`);
  const randomIpfsNft = await ethers.getContract("RandomIPFSNFT", deployer);
  const mintFee = await randomIpfsNft.getMintFee();
  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftMintTxReciept = await randomIpfsNftMintTx.wait(1);
  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000);
    randomIpfsNft.once("NftMinted", async function () {
      resolve();
    });

    if (developmentChains.includes(network.name)) {
      const requestId =
        randomIpfsNftMintTxReciept.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2Mock",
        deployer
      );
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }
  });
  console.log(
    `Random IPFS NFT Index 0 has Token URI ${await randomIpfsNft.tokenURI(0)}`
  );
  const highValue = ethers.utils.parseEther("4000");
  const dynamicSvgNft = await ethers.getContract("DynamicSVGNFT", deployer);
  const dynamicSvgNftTx = await dynamicSvgNft.mintNFT(highValue.toString());
  await dynamicSvgNftTx.wait(1);
  console.log(
    `Dynamic SVG NFT Index 0 has Token URI ${await dynamicSvgNft.tokenURI(0)}`
  );
};

module.exports.tags = ["all", "mint"];

const { ethers } = require("hardhat");
const { assert } = require("chai");
// we will be deploying these tests to run before deploying the blockchain
//it is a before each - it combination

// run => YARN HARDHAT TEST

// describe is recognized by hardhat
describe("simple-storage", function () {
  // making these outside scope so everyone can access it
  let simpleStorageFactory, simpleStorage;
  // run this function before any it
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });
  // now running all it functions one by one
  // test to see if initial value is 0
  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });
  it("should update when we call store", async function () {
    const expectedValue = "69";
    const reciept = await simpleStorage.store(expectedValue);
    await reciept.wait(1);
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });
});

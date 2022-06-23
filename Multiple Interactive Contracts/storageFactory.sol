//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./simpleStorage.sol";
contract StorageFactory{
    //creating a contract array
    SimpleStorage[] public simpleStorageArray;
    // a function to create a contract
    function createSimpleStorageContract() public {
        simpleStorageArray.push(new SimpleStorage());
    }
    // at this point we can simply deploy hence we are deploying a contract by a contract
    // creating a new function to actually be able to use the functions of the simplestore contract
    function sfStore(uint256 _index,uint256 favNum) public {
        // ABI - Application Binary Interface
        // contains a list of all the functions we can actually use from our contract
        SimpleStorage simpleStorage = simpleStorageArray[_index];
        simpleStorage.store(favNum);
    }
    // similarly a getter function to retrieve the fav number
    function sfGet(uint256 _index) public view returns(uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_index];
        return simpleStorage.retrieve();
    }
}
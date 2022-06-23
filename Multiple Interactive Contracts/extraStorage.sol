//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./simpleStorage.sol";

// inheriting Contracts
contract ExtraStorage is SimpleStorage{
    //overriding functions
    // virtual override is necessary to imply it
    function store(uint256 _favNum) public override{
        favoriteNumber = _favNum + 5;
    }
}
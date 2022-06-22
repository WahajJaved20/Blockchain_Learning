// include solidity directive (^ means any version above as well)
// license to identify shareable work
// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.7;

// Writing an actual contract
// contracts work like classes

// Datatypes we are using
// bool, uint, int, address, bytes, string
// variable initialization works normally
contract SimpleStorage {
    // every public thing can be viewed from the deployed tab so to view in test phase we can make
    // the variables public
    uint256 public favoriteNumber;
    // Creating a Function
    // the more code there is, the more computationally expensive the code gets
    //function name (parameters) access type {}
    function store(uint256 _favNum) public {
        favoriteNumber = _favNum;
    }
    // ACCESS TYPES
    // public, private, external (other contracts can call), internal (only this and its children can call)
    // GAS FREE FUNCTIONS
    // view(disallow any modifications) and pure(disallow any modification or even reading)
    function retrieve() public view returns(uint256){
        return favoriteNumber;
    }
}
// contract Address : 0xdBA793F5A8273608e662ecCce312C5b879DC9b2B
// after deployment, the functions pop up as little buttons we can make transactions
// which are like calling these functions from the sidebar
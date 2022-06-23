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
    // Creating Structures
    struct People{
        uint256 favoriteNumber;
        string name;
    }
    //creating a struct object
    People public person = People({favoriteNumber: 23,name:"Wahaj"});
    // creating an Array
    People[] public people;
    // CREATING MAPS
    //we will be telling what kind of mappings to do
    mapping(string => uint256) public nameToNumber;
    // Adding people into our array and map
    function addPerson(string memory name,uint256 _favoriteNumber) public {
        // will get to memory later 
        People memory newPerson = People({favoriteNumber: _favoriteNumber,name : name});
        people.push(newPerson);
        nameToNumber[name] = _favoriteNumber;
    }
    // Storage Locations (right now only these 3) usually specified for array,structs or mappings
    // memory(telling that its temporary,can be reassigned), calldata(temporary,cannot be reassigned)
    //, storage(default, persistent data) 
    // since string is an array of bytes, we will be using memory keyword

   
}
// after deployment, the functions pop up as little buttons we can make transactions
// which are like calling these functions from the sidebar

// Deploying to a real test net
// Select the web3 inject first connect the metamask account
// now rinkeby connection is established
// now deploy and boom
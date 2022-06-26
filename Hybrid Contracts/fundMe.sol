// BLOCKCHAIN NODES CANNOT MAKE API CALLS SINCE THEY WONT BE ABLE TO REACH CONSENSUS COZ OF DIFFERENT OUTCOMES
// AKA NON-DETERMINISM
// a contract designed so users can send funds
// we can withdraw em
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./priceConverter.sol";
// smart contracts can hold funds just like wallets
contract FundMe{
    // this line tells that we are using the functions from priceconverter as funcs from uint
    using PriceConverter for uint256;
    // the minimum amount of money we are setting
    // we meed to convert this money into eth form so the transactions are possible
    uint256 constant public MINIMUM_USD = 50 * 1e18;
    // list of funders who sent us money
    address[] public funders;
    mapping(address => uint256) addressToFunds;
    // set up an owner so only he can withdraw funds
    address immutable public i_owner;
    //immutable only declared in constructors
    // simple constructor to set up the owner (same as other langs)
    constructor(){
        i_owner = msg.sender;
    }
    // a modifier function so we can put it in function declarations for reusability
    modifier onlyOwner{
        require(msg.sender == i_owner,"Sender is not owner");
        // this underscore is necessary, it means do the rest of code
        // if this was above require then the wholecode is executed first then require is called
        _;
    }
    // function to let people send 
    // payable keyword allows us to send actual money
    function fund() public payable{
        // setting up a minimum amount
        // msg.value is global and determines how much ETH is transferred
        // library functions consider the caller as the first parameter
        require(msg.value.getConversionRate() > MINIMUM_USD,"Didnt send enough"); // 1e18 == 1 *10**18 == 1000000000000000000 wei
        // money math is done in terms of wei so and 1exponent 18 wei is 1 eth 
        // and we are setting 1 eth as the minimum amount
        // the second arg describes what to show when error is encountered
        // if the transaction isnt successfully made, the remaining gas is returned
        // msg.sender stores the address of the sender
        funders.push(msg.sender);
        addressToFunds[msg.sender] = msg.value;
    }
   
    // function for contract owner to withdraw money
    // with the only owner, the owner can only call it now
    function withdraw() public onlyOwner{
        // loop to clear out the lists
        for(uint256 i=0;i<funders.length;i++){
            addressToFunds[funders[i]] = 0;
        }
        funders = new address[](0);
        // withdrawing funds from contracts can be done in one of the three ways
        //1) transfer (if it fails it gives an error)
        // payable(msg.sender).transfer(address(this).balance);
        // msg . sender is us and (this) is the giver
        //2) send (it returns a boolean)
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // // display an error if it couldnt send
        // require(sendSuccess,"Couldnt send");
        //3) call(returns bool and anything the other function called) (RECOMMENDED WAY)
        //value field takes the amount we are going to send and the empty quotes tell that we are not sending
        // any functions coz we dont need here
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess,"Coudnt call");
        // to make the address pay us, we need to typecast into payable addresses
        // balance = the current value in ETH
        
    }
    // a way to work out transactions when no data is specified ( like sending ETH via metamask instead of
    // using the contract functions
    // 1) recieve
    receive() external payable{
        fund();
        // this is called when no data is sent in a transaction (no function call)
    }
    // 2) fallback
    fallback() external payable{
        fund();
        // this is called when some data is sent but the function doesnt exist
    }
}
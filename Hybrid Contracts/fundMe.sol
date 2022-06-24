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
    uint256 minimumUSD = 50;
    // list of funders who sent us money
    address[] public funders;
    mapping(address => uint256) addressToFunds;
    // function to let people send 
    // payable keyword allows us to send actual money
    function fund() public payable{
        // setting up a minimum amount
        // msg.value is global and determines how much ETH is transferred
        // library functions consider the caller as the first parameter
        require(msg.value.getConversionRate() > minimumUSD,"Didnt send enough"); // 1e18 == 1 *10**18 == 1000000000000000000 wei
        // money math is done in terms of wei so and 1exponent 18 wei is 1 eth 
        // and we are setting 1 eth as the minimum amount
        // the second arg describes what to show when error is encountered
        // if the transaction isnt successfully made, the remaining gas is returned
        // msg.sender stores the address of the sender
        funders.push(msg.sender);
        addressToFunds[msg.sender] = msg.value;
    }
   
    // function for contract owner to withdraw money
    function withdraw() public {}
}
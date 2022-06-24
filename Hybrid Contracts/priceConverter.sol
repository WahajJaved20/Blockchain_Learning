// a library file to make the required functions look like they
// belong to actual primitive data types

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
// github repo consisting of this interface for getting price feeds
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// library cant have state variables and it cant send ether
library PriceConverter {
     // a get price function in order to get the current value of ether in terms of USD
    function getPrice() internal view returns (uint256){
        // we need the ABi, and the address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // if we want all return values else
        //(uint80 roundId, int price,uint startedAt,uint timeStamp,uint80 answeredInRound) = priceFeed.latestRoundData();
        (,int price,,,) = priceFeed.latestRoundData();
        // this price is eth in terms of USD
        // currently it has 8 decimals so we need to round it to 18
        return uint256(price * 1e10);
    }
    // function to convert both prices
    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethInUsd = (ethAmount * ethPrice) / 1e18;
        return ethInUsd;

    }
}
//SPDX-License-Identifier:MIT

pragma solidity ^0.8.8;

/* Code Explanation */

// Enter the lottery
// pick the lottery winner randomly verifiably
// Winner to be selected every X minutes -> completely automatic
// events = event + emit calls (preffered naming conventioni s reverse of function)
// Chainlink Oracle -> Randomness
// Chainlink Keeprers -> automation

/* Imports */

// importing chain link VRF for randomness (yarn add @chainlink/contracts)
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

/* Errors */

// Error Definition since it is gas efficient
error Raffle__notEnoughETH();
error Raffle__transferFailed();
error Raffle__notOpen();
error Raffle__UpKeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffleState
);

/* Smart Contract */

/**
 * @title A lottery Contract
 * @author Wahaj Javed
 * @notice This contract is for creating an untemperable decentralized lottery
 * @dev This implements Chainlink VRF and Chainlink Keepers
 */

// inheriting from VRFConsumerBaseV2
contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Type Declarations */

    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /* State Variables */

    // i_ means immutable variable
    uint256 private immutable i_entranceFee;
    // payable since one of them will get paid on winning, s_ is storage
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private s_state;

    /* Lottery Variables */

    address payable s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */

    // the events are saved in logs which are not part of the contracts
    event raffleEnter(address indexed player);
    event requestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /* Constructor */

    constructor(
        address VRFCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(VRFCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    /* Functions */

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__notEnoughETH();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__notOpen();
        }
        s_players.push(payable(msg.sender));
        // emit an event when players get updated
        emit raffleEnter(msg.sender);
    }

    // function requestRandomWinner() external {

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        (bool upKeepNeeded, ) = checkUpkeep("");
        if (!upKeepNeeded) {
            revert Raffle__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        // Request the random number
        // acheive something with it
        // 2 transaction process
        s_raffleState = RaffleState.CALCULATING;
        // getting the function from the coordinator class
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //gasLane
            i_subscriptionId, // the contract Id which is going to help with the verification
            REQUEST_CONFIRMATIONS, // the number of blocks to be confirmed before a randomness request is made
            i_callbackGasLimit, // the limit of gas to be spent before calling
            NUM_WORDS // the number of random numbers to be returned
        );
        emit requestedRaffleWinner(requestId);
    }

    /**
     * @dev This is the function that the chainlink node keeper calls
     * they look for the upkeep needed to return true
     * The following should be true in order to return true
     * 1) Our Time Interval should have passed
     * 2) Atleast one player and have some ETH
     * 3) our subscription is funded with link
     * 4) The loterry should be in "open" state
     */

    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /*performData*/
        )
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        // current timestamp - last timestamp > interval
        bool timePassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "0x0");
    }

    function fulfillRandomWords(
        uint256, /*requestId*/ //telling solidity that yeah this is a param but we wont use it
        uint256[] memory randomWords
    ) internal override {
        // random words will only have one element since we requested for one
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__transferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /* Getters */

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}

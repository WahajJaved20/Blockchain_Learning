import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
export default function LotteryEntrace() {
  // useMoralis already knows the chain id in HEX
  const { isWeb3Enabled, chainId } = useMoralis();
  let cd = parseInt(chainId);
  //to set up rerendering
  let [entranceFee, setEntranceFee] = useState("0");
  let [numPlayers, setNumPlayers] = useState("0");
  let [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();
  const raffleAddress = cd in contractAddress ? contractAddress[cd][0] : null;
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  async function updateUI() {
    const currentEntranceFee = (await getEntranceFee()).toString();
    const currNumPlayers = (await getNumberOfPlayers()).toString();
    const lastWinner = await getRecentWinner();
    setEntranceFee(currentEntranceFee);
    setNumPlayers(currNumPlayers);
    setRecentWinner(lastWinner);
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };
  const handleNewNotification = function (tx) {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };
  return (
    <div className="p-5">
      Hi From Smart Lottery
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              // writing a handler for success with a notif popup
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => {
                  console.log(error);
                },
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number of Players : {numPlayers}</div>
          <div>Recent Winner : {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}

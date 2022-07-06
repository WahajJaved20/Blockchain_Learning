// making connection to metamask
// require doesnt work for front end JS so we will be using imports
// importing ethers after directly downloading the library
import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect-button");
const fundButton = document.getElementById("fund-button");
const balanceButton = document.getElementById("balance-button");
const withdrawButton = document.getElementById("withdraw-button");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    // API call to metamask asking for wallet to be connected
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected!");
    // updates the button state so it will show connected instead of connect option
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}
//return balance
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.parseEther(balance.toString()).toString());
  }
}
//fund
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding ${ethAmount} ...`);
  // fund only if metamask is connected
  if (typeof window.ethereum !== "undefined") {
    // provider -> connection to blockchain
    // signer -> sender
    // contract that we are interacting with
    // ^ ABI and address
    // creating our web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // since user can also reject transaction
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // listen for tx to be mined
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  // making sure that the promise is resolved before anything else happens
  // resolve -> success
  // reject -> failure
  return new Promise((resolve, reject) => {
    // wait for one event to happen with an anon listener function
    provider.once(transactionResponse.hash, function (transactionReciept) {
      console.log(
        `Confirmed with ${transactionReciept.confirmations} confirmations`
      );
      resolve();
    });
  });
}
//withdraw
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

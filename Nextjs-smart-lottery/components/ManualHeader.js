// export default helps us to share the component across files
// using REACT MORALIS for the wallet dconnection backend
// naming this manual coz its the hard way to do this

// HOOKS -> help us to re render our website when changes occur as opposed to normal variable which cannot do that
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
// with React JS, we can simply stick js into html with {}
export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  // CLASSIC REACT HOOK -> consists of a function and a dependency array, keeps constantly checking for updates
  // in the dependency array and if there is, it calls the given function
  useEffect(() => {
    // automatically enables web3 on refreshes
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  // checking if we disconnected so remove any storage and deactivate web3
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);
  return (
    <div>
      {/* THIS IS LITERALLY FRIGGIN IT, THIS IS HOW WE CONNECT TO METAMASK DAMN */}
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            // this allows us to use local storage in order to store the values we might need there
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}

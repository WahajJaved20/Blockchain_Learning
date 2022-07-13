import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
// wrapping the whole app in moralis provider to hook the whole website so we can use this
function MyApp({ Component, pageProps }) {
  return (
    // coz we dont need to mount it onto a server for this app
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;

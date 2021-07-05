import '../styles/globals.css';
import { Provider } from 'react-redux'
import { store } from '../redux/store';
let Wallet = {};
if (typeof document !== 'undefined'){
  Wallet = require("@terra-money/wallet-provider").WalletProvider
}

function MyApp({ Component, pageProps }) {
  const mainnet = {
    name: 'mainnet',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
  };
  
  const testnet = {
    name: 'testnet',
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
  };


  if(typeof document !== 'undefined') {
    return (
        <Wallet
          defaultNetwork={testnet} 
          walletConnectChainIds={{
            0: testnet,
            1: mainnet,
          }}
        >
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Wallet>
    )
  } else {
    return (
      <Component {...pageProps} />
    )
  }
}

export default MyApp;

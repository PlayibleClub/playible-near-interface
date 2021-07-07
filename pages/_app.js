import '../styles/globals.css';
import { Provider } from 'react-redux'
import { store } from '../redux/store';
import { StaticWalletProvider, WalletProvider } from '@terra-money/wallet-provider';
 
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


  // if(typeof document !== 'undefined') {
  //   return (
  //       <WalletProvider
  //         defaultNetwork={testnet} 
  //         walletConnectChainIds={{
  //           0: testnet,
  //           1: mainnet,
  //         }}
  //       >
  //         <Provider store={store}>
  //           <Component {...pageProps} />
  //         </Provider>
  //       </WalletProvider>
  //   )
  // } else {
  //   return (
  //     <Provider store={store}>
  //       <Component {...pageProps} />
  //     </Provider>
  //   )
  // }
  return process.browser ? (
    <WalletProvider
      defaultNetwork={testnet} 
      walletConnectChainIds={{
        0: testnet,
        1: mainnet,
      }}
    >
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </WalletProvider>
  ) : (
    <StaticWalletProvider
      defaultNetwork={testnet} 
    >
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </StaticWalletProvider>
  )
}

export default MyApp;

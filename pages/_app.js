import '../styles/globals.css'
import { Provider, useDispatch } from 'react-redux'
import { store } from '../redux/store'
import { StaticWalletProvider, WalletProvider } from '@terra-money/wallet-provider'
import 'regenerator-runtime/runtime'
import client from "../apollo-client.ts"
import { ApolloProvider } from "@apollo/client"

function MyApp({ Component, pageProps }) {
  const mainnet = {
    name: 'mainnet',
    chainID: 'columbus-5',
    lcd: 'https://lcd.terra.dev'
  }

  const testnet = {
    name: 'testnet',
    lcd: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12'
  }

  return process.browser ? (
    <ApolloProvider client={client}>
      <WalletProvider
        defaultNetwork={mainnet}
        walletConnectChainIds={{
          0: testnet,
          1: mainnet
        }}
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WalletProvider>
    </ApolloProvider>
  ) : (
    <ApolloProvider client={client}>
      <StaticWalletProvider
        defaultNetwork={mainnet}
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </StaticWalletProvider>
    </ApolloProvider>
  )
}

export default MyApp

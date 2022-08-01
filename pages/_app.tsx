import '../styles/globals.css'
import { Provider, useDispatch } from 'react-redux'
import { store } from '../redux/store'
import 'regenerator-runtime/runtime'
import client from "../apollo-client"
import { ApolloProvider } from "@apollo/client"
// NEAR-Wallet-Selector Integration
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import "@near-wallet-selector/modal-ui/styles.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <WalletSelectorContextProvider
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WalletSelectorContextProvider>
    </ApolloProvider>
  )
}

export default MyApp

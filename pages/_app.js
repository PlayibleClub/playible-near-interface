import '../styles/globals.css'
import { Provider, useDispatch } from 'react-redux'
import { store } from '../redux/store'
import 'regenerator-runtime/runtime'
import client from "../apollo-client.ts"
import { ApolloProvider } from "@apollo/client"
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

function MyApp({ Component, pageProps }) {
  return process.browser ? (
    <ApolloProvider client={client}>
      <WalletSelectorContextProvider
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WalletSelectorContextProvider>
    </ApolloProvider>
  ) : (
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

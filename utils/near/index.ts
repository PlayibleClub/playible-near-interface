import * as contracts from '../../data/constants/nearContracts';
import { setupWalletSelector, NetworkId } from '@near-wallet-selector/core';
import { transactions, utils, WalletConnection, providers, connect, keyStores } from 'near-api-js';

const CONTRACT_NAME = undefined;

const env = process.env.NEAR_ENV;

const getContracts = (list = []) => {
  if (list.length > 0) {
    let fetchedContracts = list.filter((item) => contracts[item] !== undefined);

    return fetchedContracts;
  }

  return undefined;
};

export async function get_near_connection() {
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const connectionConfig = {
    networkId: getConfig(),
    keyStore: myKeyStore, // first create a key store
    nodeUrl: getRPCProvider(),
    walletUrl: getWalletURL(),
    helperUrl: getHelperURL(),
    explorerUrl: getExplorerURL(),
  };
  const nearConnection = await connect({ headers: {}, ...connectionConfig });

  return nearConnection;
}

export function getConfig(): NetworkId {
  switch (env) {
    case 'production':
      return 'mainnet';
    case 'development':
      return 'testnet';
  }
}

export function getContract(contract) {
  switch (env) {
    case 'production':
      return contract.mainnet;
    case 'development':
      return contract.testnet;
  }
}

export function getRPCProvider() {
  switch (env) {
    case 'production':
      return 'https://rpc.mainnet.near.org';
    case 'development':
      return 'https://rpc.testnet.near.org';
  }
}

export function getWalletURL() {
  switch (env) {
    case 'production':
      return 'https://wallet.mainnet.near.org';
    case 'development':
      return 'https://wallet.testnet.near.org';
  }
}

export function getHelperURL() {
  switch (env) {
    case 'production':
      return 'https://wallet.mainnet.near.org';
    case 'development':
      return 'https://wallet.testnet.near.org';
  }
}
export function getExplorerURL() {
  switch (env) {
    case 'production':
      return 'https://wallet.mainnet.near.org';
    case 'development':
      return 'https://wallet.testnet.near.org';
  }
}

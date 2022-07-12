import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import * as contracts from '../../data/constants/nearContracts';
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";

const CONTRACT_NAME = undefined;

const getContracts = (list = []) => {
  if (list.length > 0) {
    let fetchedContracts = list.filter((item) => contracts[item] !== undefined);

    return fetchedContracts;
  }

  return undefined;
};

export const getConfig = (type) => {
  switch (type) {
    case 'production':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'development':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
  }
};

export const initNear = async (contract) => {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  const nearConfig = getConfig(process.env.NEAR_ENV || 'development');

  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  // Load in user's account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      // Gets the accountId as a string
      accountId: walletConnection.getAccountId(),
      // Gets the user's token balance
      balance: (await walletConnection.account().state()).amount,
      account: walletConnection.account()
    };
  }

  const selector = await setupWalletSelector({
    network: nearConfig.networkId,
    modules: [
      setupNearWallet(),
      setupMyNearWallet(),
    ],
  });
  
  const modal = setupModal(selector, {
    contractId: contract
  });


  return { currentUser, nearConfig, walletConnection };
};

// export const sendTransactions = async (account_id, contract_id, actions) => {
//   const res = account_id.signAndSendTransaction({
//     receiverId: contract_id,
//     actions
//   })
//   console.log(res)
// }

export const signIn = (wallet) => {
  wallet.requestSignIn(CONTRACT_NAME, 'Playible');
};

export const signOut = (wallet) => {
  wallet.signOut();
};

// Query minted amount
export const getSupply = async () => {};

import * as contracts from '../../data/constants/nearContracts';
import { setupWalletSelector, NetworkId } from '@near-wallet-selector/core';

const CONTRACT_NAME = undefined;

const env = process.env.NEAR_ENV;

const getContracts = (list = []) => {
  if (list.length > 0) {
    let fetchedContracts = list.filter((item) => contracts[item] !== undefined);

    return fetchedContracts;
  }

  return undefined;
};

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

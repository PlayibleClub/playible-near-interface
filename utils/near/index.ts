import * as contracts from '../../data/constants/nearContracts';
import { setupWalletSelector, NetworkId } from '@near-wallet-selector/core';

const CONTRACT_NAME = undefined;

const getContracts = (list = []) => {
  if (list.length > 0) {
    let fetchedContracts = list.filter((item) => contracts[item] !== undefined);

    return fetchedContracts;
  }

  return undefined;
};

export function getConfig(type): NetworkId {
  switch (type) {
    case 'production':
      return 'mainnet';
    case 'development':
      return 'testnet';
  }
}

import moxios from 'moxios';
import TestUtils from '../../utils';
import { connectVerifyWallet } from '../../../redux/reducers/contract/wallet';

const { storeFactory } = TestUtils();

describe('connectVerifyWallet', () => {
  beforeEach(() => {
    moxios.install();
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test.skip('should return wallet info'
  , () => {
    const store = storeFactory();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
         status: 200,
         response: {
          address: 'terra16twetz7x39lsqflmepnpup77a7dsjwzzyhdmx9',
          coins: { _coins: { uluna: [Coin], uusd: [Coin] } },
          public_key: {
            type: 'tendermint/PubKeySecp256k1',
            value: 'AtMe4McGnENSwphKNVjMWyy5JXnL1n28yEMRG9uwc2zC'
          },
          account_number: 49651,
          sequence: 8
         }
      })
    });

    return store.dispatch(connectVerifyWallet()).then(() => {
      const result  = store.getState().account_number;
      console.log(result)
    })
  })
})
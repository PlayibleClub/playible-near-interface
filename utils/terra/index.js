import { LCDClient } from '@terra-money/terra.js';
// import { MsgExecuteContract } from '@terra-money/terra.js'
// let connectedWallet = {}
// // if (typeof document !== 'undefined') {
// //   connectedWallet = require('@terra-money/wallet-provider').useConnectedWallet();
// // }

export const terra = new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
});

export const queryContract = async (contractAddr, queryMsg) => {
  try {
    const result = await terra.wasm.contractQuery(
      contractAddr,
      JSON.parse(queryMsg),
    );
    return result;
  } catch (e) {
    return {
      "error": e,
      "message": "Failed to get latest result from consumer contract"
    }
  }
};

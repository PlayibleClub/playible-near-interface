import {
  UserDenied,
  CreateTxFailed,
  Timeout,
  TxUnspecifiedError
} from '@terra-money/wallet-provider';
import { MsgExecuteContract, LCDClient } from '@terra-money/terra.js';

export const terra = new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
});

export const queryContract = async (contractAddr, queryMsg) => {
  return await terra.wasm.contractQuery(
    contractAddr,
    JSON.parse(queryMsg),
  )
};

export const executeContract = async (connectedWallet, contractAddr, executeMsg, coinAmount) => {
  const txResult = {
    txResult: null,
    txError: null
  };
  const parsedAmount = (Number.isNaN(parseFloat(coinAmount))) ? 2 : parseFloat(coinAmount);
  try {
    await connectedWallet.post({
      msgs: [
        new MsgExecuteContract(
          connectedWallet.walletAddress,  // Wallet Address
          contractAddr,                   // Contract Address
          JSON.parse(executeMsg),         // ExecuteMsg
          { uluna: parsedAmount * 1_000_000 },
        ),  
      ],
      // gasPrices: new StdFee(10_000_000, { uluna: 2000000 }).gasPrices(),
      // gasAdjustment: 1.1,
    }).then((result) => {
      txResult.txResult = result;
    }).catch((error) => {
      if (error instanceof UserDenied) {
        throw 'User Denied';
      } else if (error instanceof CreateTxFailed) {
        throw `Create Tx Failed: ${error.message}`;
      } else if (error instanceof TxFailed) {
        throw `Tx Failed: ${error.message}`;
      } else if (error instanceof Timeout) {
        throw 'Timeout';
      } else if (error instanceof TxUnspecifiedError) {
        throw `Unspecified Error: ${error.message}`;
      } else {
        throw `Unknown Error: ${error instanceof Error ? error.message : String(error)}`;
      }
  })
  } catch (error){
    throw `Failed to connect to wallet`
  }
  return txResult
}

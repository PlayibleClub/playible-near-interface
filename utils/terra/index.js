import {
  UserDenied,
  CreateTxFailed,
  TxFailed,
  Timeout,
  TxUnspecifiedError
} from '@terra-money/wallet-provider';
import { MsgExecuteContract, LCDClient, StdFee, Coins } from '@terra-money/terra.js';

export const terra = new LCDClient({
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
});

export const queryContract = async (contractAddr, queryMsg) => {
  return await terra.wasm.contractQuery(
    contractAddr,
    JSON.parse(queryMsg),
  )
};

export const executeContract = async (connectedWallet, contractAddr, executeMsg, coins={}) => {
  const txResult = {
    txResult: null,
    txError: null
  };
  
  const executeContractMsg = [
    new MsgExecuteContract(
      connectedWallet.walletAddress,  // Wallet Address
      contractAddr,                   // Contract Address
      JSON.parse(executeMsg),         // ExecuteMsg
      coins
    ),  
  ]

  const estimatedFee = await terra.tx.estimateFee(connectedWallet.walletAddress, executeContractMsg)

  try {
    await connectedWallet.post({
      msgs: executeContractMsg,
      fee: estimatedFee
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
    console.log(error)
    throw `Failed to connect to wallet`
  }
  return txResult
}

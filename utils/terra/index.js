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

export const estimateFee = async (walletAddress, executeContractMsg, gasPrices = { uusd: 0.456 }, feeDenoms = ["uusd"]) => {
  const estimatedFee = await terra.tx.estimateFee(
    walletAddress, 
    executeContractMsg, 
    { gasPrices: gasPrices, feeDenoms: feeDenoms } //use UST as gas by default
  )
  .catch((error) => {
    throw `Estimate Fee Error: ${error instanceof Error ? error.message : String(error)}`;
  })
  return estimatedFee
}

export const executeContract = async (connectedWallet, contractAddr, executeMsg, estimatedFee = null, coins={}) => {
  const txResult = {
    txResult: null,
    txInfo: null,
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
  if(estimatedFee == null){
    estimatedFee = await estimateFee(connectedWallet.walletAddress, executeContractMsg)
  }
  

  try {
    await connectedWallet.post({
      msgs: executeContractMsg,
      fee: estimatedFee
      //fee: new StdFee(1_000_000, { uusd: 90_000_000 }) 
      // gasAdjustment: 1.1,
    }).then(async (result) => {
      let hasRetrievedTxHash = true;
      txResult.txResult = result;
      while(hasRetrievedTxHash){
        //try to query transaction info every 2 seconds until the transaction is reflected in the block
        await terra.tx.txInfo(result.result.txhash).then((result) => {
          txResult.txInfo = result;
          hasRetrievedTxHash = false;
        }).catch(async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
        })
      }

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


import {
  useConnectedWallet,
  UserDenied,
  CreateTxFailed,
  Timeout,
  TxUnspecifiedError
} from '@terra-money/wallet-provider';
import { MsgExecuteContract, LCDClient } from '@terra-money/terra.js';

//TODO: Fix wallet connection problems to test contract execution functions with redux

const WalletHelper = () => {
  const connectedWallet = useConnectedWallet();

  const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev',
    chainID: 'tequila-0004',
  });

  const queryContract = async (contractAddr, queryMsg) => {
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

  const executeContract = async (contractAddr, executeMsg, coinAmount) => {
    const txResult = {
      txResult: null,
      txError: null
    };
    const parsedAmount = (Number.isNaN(parseFloat(coinAmount))) ? 2 : parseFloat(coinAmount);
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
        txResult.txError = 'User Denied';
      } else if (error instanceof CreateTxFailed) {
        txResult.txError = `Create Tx Failed: ${error.message}`;
      } else if (error instanceof TxFailed) {
        txResult.txError = `Tx Failed: ${error.message}`;
      } else if (error instanceof Timeout) {
        txResult.txError = 'Timeout';
      } else if (error instanceof TxUnspecifiedError) {
        txResult.txError = `Unspecified Error: ${error.message}`;
      } else {
        txResult.txError = `Unknown Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    })
    return txResult
  }

  return { queryContract, executeContract };
}

export default WalletHelper
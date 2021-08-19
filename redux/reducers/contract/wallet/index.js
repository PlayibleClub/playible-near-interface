/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  useConnectedWallet,
  UserDenied,
  CreateTxFailed,
  Timeout,
  TxUnspecifiedError
} from '@terra-money/wallet-provider';

//TODO: Fix wallet connection problems to test contract execution functions with redux

export const executeContract = (state, contractAddr, executeMsg) => {
  const connectedWallet = useConnectedWallet();
  const txResult = null;
  const txError = null;
  connectedWallet.post({
    msgs: [
      new MsgExecuteContract(
        connectedWallet.walletAddress,  // Wallet Address
        contractAddr,                   // Contract Address
        JSON.parse(executeMsg),         // ExecuteMsg
        { uluna: parseFloat(offeredCoin) * 1_000_000 },
      ),  
    ],
    // gasPrices: new StdFee(10_000_000, { uluna: 2000000 }).gasPrices(),
    // gasAdjustment: 1.1,
  }).then((result) => {
    txResult = result;
  }).catch((error) => {
    if (error instanceof UserDenied) {
      txError = 'User Denied';
    } else if (error instanceof CreateTxFailed) {
      txError = `Create Tx Failed: ${error.message}`;
    } else if (error instanceof TxFailed) {
      txError = `Tx Failed: ${error.message}`;
    } else if (error instanceof Timeout) {
      txError = 'Timeout';
    } else if (error instanceof TxUnspecifiedError) {
      txError = `Unspecified Error: ${error.message}`;
    } else {
      txError = `Unknown Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }).finally(() => {
    return {
      ...state,
      txResult: txResult,
      txError: txError
    }
  });
};

const initialState = {
  txResults: null,
  txError: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialState,
  reducers: {
    executeContract
  },
  extraReducers: {},
});

export default walletSlice.reducer;

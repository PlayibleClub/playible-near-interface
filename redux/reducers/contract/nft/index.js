/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, estimateFee, queryContract, retrieveTxInfo } from '../../../../utils/terra';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';
import * as contracts from '../../../../data/constants/contracts';


export const approveMarketplace = createAsyncThunk('approveMarketplace', async (payload, thunkAPI) => {
  try {
    const { connectedWallet, tokenID } = payload;

    const executeMsg = `{ "approve": { "spender": "${ contracts.MARKETPLACE }", "token_id": "${ tokenID }" } }`;
    const result = await executeContract(connectedWallet, contracts.CW721, executeMsg);

    return {
      response: result,
      status: statusCode.SUCCESS
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

const initialState = {
  txInfo: null,
  txResponse: null,
  txFee: 0,
  message: '',
  status: statusCode.IDLE,
  action: ''
}

const nftSlice = createSlice({
  name: 'nft',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [approveMarketplace.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_PENDING
      };
    },
    [approveMarketplace.fulfilled]: (state, action) => {
      return {
        ...state,
        txInfo: action.payload.response,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS
      };
    },
    [approveMarketplace.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response
      };
    },
  },
});

export const { clearData } = nftSlice.actions;
export default nftSlice.reducer;

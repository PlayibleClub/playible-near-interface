/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, queryContract, retrieveTxInfo } from '../../../../utils/terra';
import { marketplaceData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';

const initialState = {
  txInfo: null,
  txResponse: null,
  message: '',
  status: statusCode.IDLE,
  action: '',
  contract_addr: '',
  owner_addr: '',
  buyer_addr: '',
  token_id: '',
  price: 0,
}

export const purchaseToken = createAsyncThunk('purchaseToken', async (payload, thunkAPI) => {
  try {
    const { connectedWallet } = payload;

    if(price == null){
      return thunkAPI.rejectWithValue({
        response: "Pack Price cannot be null. Please query the pack price from the smart contract.",
        status: statusCode.ERROR
      });
    }
    const executeMsg = `{
      "temp_execute_transaction": {
          "contract_addr": ${contract_addr},
          "owner_addr": ${owner_addr},
          "token_id": ${token_id},
          "buyer_addr": ${buyer_addr},
          "price": ${price}
      }
    }`;
    const coins = {
      uusd: price
    }
    const result = await executeContract(connectedWallet, marketplaceData.contract_addr, executeMsg, coins);
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

export const getPurchaseTokenResponse = createAsyncThunk('getPurchaseTokenResponse', async (payload, thunkAPI) => {
  try {
    // const txInfo = thunkAPI.getState().contract.pack.txInfo;
    // const txResponse = await retrieveTxInfo(txInfo.txHash)
    return {
      // response: txResponse.logs[0],
      // drawList: txResponse.logs[0].eventsByType.wasm.token_id,
      status: statusCode.CONFIRMED
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
    
  },
  extraReducers: {
    [purchaseToken.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_PENDING
      };
    },
    [purchaseToken.fulfilled]: (state, action) => {
      return {
        ...state,
        txInfo: action.payload.response,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS
      };
    },
    [purchaseToken.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response
      };
    },
    [getPurchaseTokenResponse.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getPurchaseTokenResponse.fulfilled]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS
      };
    },
    [getPurchaseTokenResponse.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response
      };
    },
  },
});

export const { clearData } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;

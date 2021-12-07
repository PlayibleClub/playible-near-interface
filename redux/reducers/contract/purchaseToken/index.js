/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, estimateFee, retrieveTxInfo } from '../../../../utils/terra';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { marketplaceData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';


const initialState = {
  txInfo: null,
  txResponse: null,
  message: '',
  status: statusCode.IDLE,
  action: '',
  txFee: 0
}

export const purchaseToken = createAsyncThunk('purchaseToken', async (payload, thunkAPI) => {
  try {
    const { connectedWallet } = payload;

    const contractAddr = 'terra1c7sppnddt9kw4g3mcvvhm0awtvl65fvhsactup';
    const ownerAddr = 'terra1f8wkdt7sms3c3tucaqle7yvn59v8qz27srlghj';
    const buyerAddr = 'terra1jrg2hv92xpjl4wwgd84jcm4cs2pfmzdxl6y2sx';
    const tokenID = 'LBJC23';
    const tokenPrice = 10;

    const executeMsg = 
    `{
      "temp_transaction": {
          "contract_addr": ${contractAddr},
          "owner_addr": ${ownerAddr},
          "token_id": ${tokenID},
          "buyer_addr": ${buyerAddr},
          "price": ${tokenPrice}
      }
    }`;
    const coins = {
      uusd: tokenPrice
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
    const txInfo = thunkAPI.getState().contract.marketplace.txInfo;
    const txResponse = await retrieveTxInfo(txInfo.txHash)
    return {
      response: txResponse.logs[0],
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

export const estimatePurchaseFee = createAsyncThunk('estimatePurchaseFee', async (payload, thunkAPI) => {
  try{
    const { connectedWallet } = payload;

    const contractAddr = 'terra1c7sppnddt9kw4g3mcvvhm0awtvl65fvhsactup';
    const ownerAddr = 'terra1f8wkdt7sms3c3tucaqle7yvn59v8qz27srlghj';
    const buyerAddr = 'terra1jrg2hv92xpjl4wwgd84jcm4cs2pfmzdxl6y2sx';
    const tokenID = 'LBJC23';
    const tokenPrice = 10;

    const executeContractMsg = [
      new MsgExecuteContract(
        connectedWallet.walletAddress,         // Wallet Address
        marketplaceData.contract_addr,         // Contract Address
        JSON.parse(
          `{
            "temp_transaction": {
                "contract_addr": ${contractAddr},
                "owner_addr": ${ownerAddr},
                "token_id": ${tokenID},
                "buyer_addr": ${buyerAddr},
                "price": ${tokenPrice}
            }
          }`
        ), // ExecuteMsg
        { uusd: tokenPrice }
      ),  
    ]
    const response = await estimateFee(connectedWallet.walletAddress, executeContractMsg)
    const amount = response.amount._coins.uusd.amount

    return {
      response: amount.d / 10**amount.e //estimated transaction fee
    }

  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
})

const purchaseTokenSlice = createSlice({
  name: 'purchaseToken',
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
        txResponse: action.payload.response,
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
    [estimatePurchaseFee.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [estimatePurchaseFee.fulfilled]: (state, action) => {
      return {
        ...state,
        txFee: action.payload.response,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [estimatePurchaseFee.rejected]: (state, action) => {
      return {
        ...state,
        message: action.payload.response,
        status: action.payload.status,
        action: actionType.GET
      };
    },
  },
});

export const { clearData } = purchaseTokenSlice.actions;
export default purchaseTokenSlice.reducer;

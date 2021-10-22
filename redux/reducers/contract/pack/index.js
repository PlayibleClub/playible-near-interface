/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, queryContract, retrieveTxInfo } from '../../../../utils/terra';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';

const initialState = {
  latestRound: null,
  drawList: [],
  txInfo: null,
  txResponse: null,
  message: '',
  packPrice: null,
  status: statusCode.IDLE,
  action: ''
}

export const purchasePack = createAsyncThunk('purchasePack', async (payload, thunkAPI) => {
  try {
    const { connectedWallet } = payload;
    const packPrice = thunkAPI.getState().contract.pack.packPrice;
    if(packPrice == null){
      return thunkAPI.rejectWithValue({
        response: "Pack Price cannot be null. Please query the pack price from the smart contract.",
        status: statusCode.ERROR
      });
    }
    const executeMsg = `{ "purchase_pack": {} }`;
    const coins = {
      uusd: packPrice
    }
    const result = await executeContract(connectedWallet, fantasyData.contract_addr, executeMsg, coins);
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

export const getPurchasePackResponse = createAsyncThunk('getPurchasePackResponse', async (payload, thunkAPI) => {
  try {
    const txInfo = thunkAPI.getState().contract.pack.txInfo;
    const txResponse = await retrieveTxInfo(txInfo.txHash)
    return {
      response: txResponse.logs[0],
      drawList: txResponse.logs[0].eventsByType.wasm.token_id,
      status: statusCode.CONFIRMED
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

export const getPackPrice = createAsyncThunk('getPackPrice', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"pack_price":{}}`;
    const result = await queryContract(contractAddr, queryMsg);
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

export const getLastRound = createAsyncThunk('getLastRound', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"last_round":{}}`;
    const result = await queryContract(contractAddr, queryMsg);
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

export const getRoundData = createAsyncThunk('getRoundData', async (payload, thunkAPI) => {
  try {
    const { lastRound } = payload;

    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"purchased_pack":{ "last_round": "${lastRound}" }}`;
    const result = await queryContract(contractAddr, queryMsg);
    return {
      response: result,
      status: statusCode.SUCCESS
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({err});
  }
});

const processRoundData = (data) => {
  const processedData = []
  let i = 0
  if(data !== null && data.length > 0){
    data.forEach((item) => {
      const token = tokenData.find(token => token.symbol === item.slice(0, 3))
      if(typeof token !== 'undefined' && i >= data.length - 6){
        processedData.push(token.id)
      }
      i++
    })
  }

  return processedData
}

const packSlice = createSlice({
  name: 'pack',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
    
  },
  extraReducers: {
    [purchasePack.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_PENDING
      };
    },
    [purchasePack.fulfilled]: (state, action) => {
      return {
        ...state,
        txInfo: action.payload.response,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS
      };
    },
    [purchasePack.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response
      };
    },
    [getPurchasePackResponse.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getPurchasePackResponse.fulfilled]: (state, action) => {
      return {
        ...state,
        txResponse: action.payload.response,
        drawList: processRoundData(action.payload.drawList),
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS
      };
    },
    [getPurchasePackResponse.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response
      };
    },
    [getPackPrice.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [getPackPrice.fulfilled]: (state, action) => {
      return {
        ...state,
        packPrice: action.payload.response,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getPackPrice.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getLastRound.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [getLastRound.fulfilled]: (state, action) => {
      return {
        ...state,
        latestRound: action.payload.response,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getLastRound.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getRoundData.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [getRoundData.fulfilled]: (state, action) => {
      return {
        ...state,
        drawList: processRoundData(action.payload.response),
        status: action.payload.status,
        action: actionType.GET
        
      };
    },
    [getRoundData.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET
      };
    },
  },
});

export const { clearData } = packSlice.actions;
export default packSlice.reducer;

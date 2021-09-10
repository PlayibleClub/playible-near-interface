/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, queryContract } from '../../../../utils/terra';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as actionType from '../../../../data/constants/actions';

const initialState = {
  latestRound: null,
  drawList: [],
  txInfo: null,
  status: statusCode.PENDING,
  action: ''
}

export const purchasePack = createAsyncThunk('purchasePack', async (payload, thunkAPI) => {
  try {
    const { connectedWallet } = payload;
    const executeMsg = `{ "purchase_pack": {} }`;
    const result = await executeContract(connectedWallet, fantasyData.contract_addr, executeMsg);
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
        action: actionType.EXECUTE
      };
    },
    [purchasePack.fulfilled]: (state, action) => {
      return {
        ...state,
        txInfo: action.payload.response,
        status: action.payload.status,
        action: actionType.EXECUTE
      };
    },
    [purchasePack.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE
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

/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryContract } from '../../../../utils/terra';
import { fantasyData, tokenData } from '../../../../data';

const initialState = {
  latestRound: null,
  drawList: []
}

export const getLastRound = createAsyncThunk('getLastRound', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"last_round":{}}`;
    const result = await queryContract(contractAddr, queryMsg);
    return result
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

export const getRoundData = createAsyncThunk('getRoundData', async (payload, thunkAPI) => {
  try {
    const { lastRound } = payload;

    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"purchased_pack":{ "last_round": "${lastRound}" }}`;
    const result = await queryContract(contractAddr, queryMsg);
    return result
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const processRoundData = (data) => {
  const processedData = []
  if(data !== null && data.length > 0){
    data.forEach((item) => {
      processedData.push(tokenData.find(token => token.symbol === item.slice(0, 3)).id)
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
    [getLastRound.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getLastRound.fulfilled]: (state, action) => {
      return {
        ...state,
        latestRound: action.payload
      };
    },
    [getLastRound.rejected]: (state) => {
      return {
        ...state,
      };
    },
    [getRoundData.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getRoundData.fulfilled]: (state, action) => {
      return {
        ...state,
        drawList: processRoundData(action.payload)
        //drawList: processRoundData(["0", "1", "2", "3", "4"]) //test data, syntax is not final
        
      };
    },
    [getRoundData.rejected]: (state) => {
      return {
        ...state,
      };
    },
  },
});

export const { clearData } = packSlice.actions;
export default packSlice.reducer;

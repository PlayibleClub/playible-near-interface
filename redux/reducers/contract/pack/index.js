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

export const getDrawData = createAsyncThunk('getLastRound', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"purchased_pack":{ "last_round": "lastRound" }}`;
    const result = await queryContract(contractAddr, queryMsg);
    return result
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const processDrawData = (data) => {
  const processedData = []
  if(data !== null && data.length > 0){
    data.forEach((item) => {
      processedData.push(tokenData.find(token => token.terraID === item).id)
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
    [getDrawData.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getDrawData.fulfilled]: (state, action) => {
      return {
        ...state,
        //drawList: processDrawData(action.payload)
        drawList: processDrawData(["0", "1", "2", "3", "4"]) //test data, syntax is not final
        
      };
    },
    [getDrawData.rejected]: (state) => {
      return {
        ...state,
      };
    },
  },
});

export const { clearData } = packSlice.actions;
export default packSlice.reducer;

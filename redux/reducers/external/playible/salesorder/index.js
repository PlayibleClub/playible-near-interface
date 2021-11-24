/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../../utils/statsperform';
import { checkResponseValidity } from '../../../../utils/general';

const initialState = {
  message: '',
  packPrice: null,
  status: statusCode.IDLE,
  action: ''
}

export const salesOrder = createAsyncThunk('salesOrder', async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/participants' + generateAuth());
    const { response: validatedResponse, valid } = checkResponseValidity(response);

    if (valid) {
      return validatedResponse;
    }
    else {
      return thunkAPI.rejectWithValue(validatedResponse);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

export const getSalesOrderResponse = createAsyncThunk('getSalesOrderResponse', async (payload, thunkAPI) => {
  try {
    const txInfo = thunkAPI.getState().contract.pack.txInfo;
    const txResponse = await retrieveTxInfo(txInfo.txHash)
    return {
      response: txResponse.logs[0],
      status: statusCode.CONFIRMED
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

export const getSalesData = createAsyncThunk('getSalesData', async (payload, thunkAPI) => {
  try {
    const txInfo = thunkAPI.getState().contract.pack.txInfo;
    const txResponse = await retrieveTxInfo(txInfo.txHash)
    return {
      response: txResponse.logs[0],
      status: statusCode.CONFIRMED
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

const salesSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [salesOrder.pending]: (state) => {
      return {
        ...state,
      };
    },
    [salesOrder.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    [salesOrder.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default salesSlice.reducer;

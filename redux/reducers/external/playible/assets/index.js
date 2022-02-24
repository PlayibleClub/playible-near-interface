/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../../utils/playible';
import * as statusCode from '../../../../../data/constants/status';
import * as actionType from '../../../../../data/constants/actions';
import * as contracts from '../../../../../data/constants/contracts';

const initialState = {
  list: [],
  message: '',
  status: statusCode.IDLE,
  action: '',
};

export const getAccountAssets = createAsyncThunk('getAccountAssets', async (payload, thunkAPI) => {
  try {
    const { walletAddr } = payload;
    const result = await axiosInstance.get(
      `/account/athlete_tokens/${walletAddr}/collection/${contracts.ATHLETE}`
    );
    console.log('result', result)
    return {
      response: result,
      status: statusCode.SUCCESS,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR,
    });
  }
});

const processAssetListData = (data) => {
  const processedData = [];
  if (data.length > 0) {
    data.forEach((item) => {
      processedData.push(item);
    });
  }

  return processedData;
};

const assetSlice = createSlice({
  name: 'asset',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [getAccountAssets.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [getAccountAssets.fulfilled]: (state, action) => {
      return {
        ...state,
        list: processAssetListData(action.payload.response.data),
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getAccountAssets.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
  },
});

export const { clearData } = assetSlice.actions;
export default assetSlice.reducer;

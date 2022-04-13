/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, queryContract } from '../../../../utils/terra';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as actionType from '../../../../data/constants/actions';

const initialState = {
  tokenList: [],
  status: statusCode.PENDING,
  action: ''
}

export const getPortfolio = createAsyncThunk('getPortfolio', async (payload, thunkAPI) => {
  try {
    const { walletAddr } = payload;
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = 
      `{
        "user_tokens": {
          "user_addr": "${ walletAddr }"
        }
      }`;
    const result = await queryContract(contractAddr, queryMsg);
    if(result.length === 0){
      return thunkAPI.rejectWithValue({
        response: "This wallet does not hold any athlete tokens yet",
        status: statusCode.WARNING
      });
    }
    else {
      return {
        response: result,
        status: statusCode.SUCCESS
      }
    }

  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

const processPortfolioData = (data) => {
  const processedData = []
  if(data !== null && data.length > 0){
    data.forEach((item) => {
      const token = tokenData.find(token => token.symbol === item.slice(0, 3))
      if(typeof token !== 'undefined'){
        processedData.push({
          ...token,
          tokenID: item.charAt(item.length - 1)
        })
      }
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
    [getPortfolio.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [getPortfolio.fulfilled]: (state, action) => {
      return {
        ...state,
        tokenList: processPortfolioData(action.payload.response),
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getPortfolio.rejected]: (state, action) => {
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

/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, queryContract } from '../../../../utils/terra';
import { fantasyData, tokenData } from '../../../../data';

const initialState = {
  tokenList: []
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
    return result
  } catch (err) {
    return thunkAPI.rejectWithValue({err});
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
      };
    },
    [getPortfolio.fulfilled]: (state, action) => {
      return {
        ...state,
        tokenList: processPortfolioData(action.payload)
      };
    },
    [getPortfolio.rejected]: (state) => {
      return {
        ...state,
      };
    },
  },
});

export const { clearData } = packSlice.actions;
export default packSlice.reducer;

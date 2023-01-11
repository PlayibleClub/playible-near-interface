import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  sportType: '',
}

export const sportSlice = createSlice({
  name: "sportType",
  initialState,
  reducers: {
    setSportTypeRedux(state, action){
      state.sportType = action.payload;
    }

    
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const { setSportTypeRedux } = sportSlice.actions;
export const getSportTypeRedux = (state) => state.sportType;

export default sportSlice.reducer;
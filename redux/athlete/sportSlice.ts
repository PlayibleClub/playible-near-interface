import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  sportType: 'NFL',
}

export const sportSlice = createSlice({
  name: "sportType",
  initialState,
  reducers: {
    setSportType(state, action){
      state.sportType = action.payload;
    }
  }
});

export const { setSportType } = sportSlice.actions;
export const getSportType = (state) => state.sportType.sportType;

export default sportSlice.reducer;
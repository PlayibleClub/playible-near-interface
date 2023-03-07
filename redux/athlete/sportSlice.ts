import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  sportType: '',
  isPromo: false,
}

export const sportSlice = createSlice({
  name: "sportType",
  initialState,
  reducers: {
    setSportTypeRedux(state, action){
      state.sportType = action.payload;
    },
    setIsPromoRedux(state, action){
      state.isPromo = action.payload;
    }

    
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const { setSportTypeRedux, setIsPromoRedux } = sportSlice.actions;
export const getSportTypeRedux = (state) => state.sportType.sportType;
export const getIsPromoRedux = (state) => state.sportType.isPromo;
export default sportSlice.reducer;
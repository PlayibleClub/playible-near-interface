import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  teamName: '',
  accountId: '',
  gameId: 0,
}

export const teamSlice = createSlice({
  name: 'teamDetails',
  initialState,
  reducers: {
    setTeamName(state, action){
      state.teamName = action.payload;
    },
    setAccountId(state, action){
      state.accountId = action.payload;
    },
    setGameId(state, action){
      state.gameId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const { setTeamName, setAccountId, setGameId} = teamSlice.actions;

export const selectTeamName = (state) => state.teamDetails.teamName;
export const selectAccountId = (state) => state.teamDetails.accountId;
export const selectGameId = (state) => state.teamDetails.gameId;

export default teamSlice.reducer;
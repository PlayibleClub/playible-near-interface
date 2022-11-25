import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';


const initialState = {
  athleteState: ["hello", "world"],
}

export const athleteSlice = createSlice({
  name: "athleteLineup",
  initialState,
  reducers: {

    setAthleteState(state, action) {
      state.athleteState = action.payload;
    },

  }
});

export const { setAthleteState } = athleteSlice.actions;

export default athleteSlice.reducer;

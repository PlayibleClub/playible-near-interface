import { createSlice } from '@reduxjs/toolkit';
import { string } from 'prop-types';
import { PURGE } from 'redux-persist';

const initialState = {
  athleteLineup: [],
  game_id: 0,
  index: 0,
  teamName: "",
  position: ""
}


export const athleteSlice = createSlice({
  name: "athleteLineup",
  initialState,
  reducers: {

    setAthleteLineup(state, action) {
      state.athleteLineup = action.payload;
    },
    setGameId(state, action) {
      state.game_id = action.payload;
    },
    setIndex(state, action) {
      state.index = action.payload;
    },
    setTeamNameRedux(state, action) {
      state.teamName = action.payload;
    },
    setPosition(state, action) {
      state.position = action.payload;
    }

  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const { setAthleteLineup, setGameId, setIndex, setTeamNameRedux, setPosition } = athleteSlice.actions;

export const getAthleteLineup = (state) => state.athlete.athleteLineup;
export const getGameId = (state) => state.athlete.game_id;
export const getIndex = (state) => state.athlete.index;
export const getTeamName = (state) => state.athlete.teamName;
export const getPosition = (state) => state.athlete.position;
export default athleteSlice.reducer;
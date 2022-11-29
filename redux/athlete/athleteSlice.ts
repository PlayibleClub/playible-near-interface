import { createSlice } from '@reduxjs/toolkit';
import { string } from 'prop-types';


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

  }
});

export const { setAthleteLineup, setGameId, setIndex, setTeamNameRedux, setPosition } = athleteSlice.actions;

export const selectAthleteLineup = (state) => state.athlete.athleteLineup;
export const selectGameId = (state) => state.athlete.game_id;
export const selectIndex = (state) => state.athlete.index;
export const selectTeamName = (state) => state.athlete.teamName;
export const selectPosition = (state) => state.athlete.position;
export default athleteSlice.reducer;
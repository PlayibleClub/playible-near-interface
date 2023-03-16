import { createSlice } from '@reduxjs/toolkit';
import { string } from 'prop-types';
import { PURGE } from 'redux-persist';

const initialState = {
  athleteLineup: [],
  game_id: 0,
  gameStartDate: 0,
  gameEndDate: 0,
  index: 0,
  teamName: "",
  position: "",
  sport: "",
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
    setGameStartDate(state, action){
      state.gameStartDate = action.payload;
    },
    setGameEndDate(state, action){
      state.gameEndDate = action.payload
    },
    setIndex(state, action) {
      state.index = action.payload;
    },
    setTeamNameRedux(state, action) {
      state.teamName = action.payload;
    },
    setPosition(state, action) {
      state.position = action.payload;
    },
    setSport(state, action){
      state.sport = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const { setAthleteLineup, setGameId, setGameStartDate, setGameEndDate, setIndex, setTeamNameRedux, setPosition, setSport } = athleteSlice.actions;

export const getAthleteLineup = (state) => state.athlete.athleteLineup;
export const getGameId = (state) => state.athlete.game_id;
export const getGameStartDate = (state) => state.athlete.gameStartDate;
export const getGameEndDate = (state) => state.athlete.gameEndDate;
export const getIndex = (state) => state.athlete.index;
export const getTeamName = (state) => state.athlete.teamName;
export const getPosition = (state) => state.athlete.position;
export const getSport = (state) => state.athlete.sport;
export default athleteSlice.reducer;
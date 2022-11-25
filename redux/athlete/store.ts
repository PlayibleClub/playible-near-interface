import { configureStore } from '@reduxjs/toolkit';
import athleteReducer from '../athlete/athleteSlice';
export default configureStore({
  reducer: {
    athleteLineup: athleteReducer
  }
})
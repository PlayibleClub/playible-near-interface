import { configureStore } from '@reduxjs/toolkit';

import athleteReducer from './athleteSlice';

export default configureStore({
  reducer: {
    athlete: athleteReducer
  }
});
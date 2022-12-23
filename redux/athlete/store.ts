import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import athleteReducer from './athleteSlice';
import sportReducer from './sportSlice';
const persistConfig = {
  key: 'root',
  storage,
}

const persistedAthlete = persistReducer(persistConfig, athleteReducer);
const persistedSport = persistReducer(persistConfig, sportReducer);
export const store = configureStore({
  reducer: {
    athlete: persistedAthlete,
    teamDetails: persistedSport,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

export const persistor = persistStore(store);
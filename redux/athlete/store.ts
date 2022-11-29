import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import athleteReducer from './athleteSlice';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, athleteReducer);

export const store = configureStore({
  reducer: {
    athlete: persistedReducer
  }
});

export const persistor = persistStore(store);
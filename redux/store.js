/* eslint-disable import/no-extraneous-dependencies,
no-underscore-dangle, no-shadow,
import/prefer-default-export */

import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';

const logger = createLogger({
    timestamps: true,
    duration: true,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
    stateReconciler: autoMergeLevel1,
};

let middlewares = [];
if (process.env.NODE_ENV === 'production') {
  middlewares = [...middlewares, reduxThunk];
} else {
  middlewares = [...middlewares, reduxThunk, logger];
}

const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(pReducer, compose(applyMiddleware(...middlewares)));
export const persistor = persistStore(store);

import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore}  from "redux-persist"
import IsUISlice, { AuthSlice } from './uiSlice';
import {API} from '../api/Api';
import MessageSlice from './messageSlice';
import CallSlice from './callSlice';
import RewardSlice from './rewardSlice';
const rootReducer = combineReducers({
  [API.reducerPath]: API.reducer,
  Auth:AuthSlice.reducer,
  Message:MessageSlice.reducer,
  Calls:CallSlice.reducer,
  Rewards:RewardSlice.reducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(API.middleware),
});


export const persistor = persistStore(store)
export type IRootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch

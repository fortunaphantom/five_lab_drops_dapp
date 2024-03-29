import { configureStore } from '@reduxjs/toolkit';
import web3Reducer from 'slices/web3Slice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import viewState from 'slices/viewState';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})


export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    viewState: viewState,
  },
  middleware: customizedMiddleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


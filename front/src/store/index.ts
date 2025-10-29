import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import contactReducer from './contactSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

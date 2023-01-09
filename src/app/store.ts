import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import deskReducer from '../features/tictactoe/desk';

export const store = configureStore({
  reducer: {
    desk: deskReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

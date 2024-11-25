import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "./features/authSlice";
import { SessionSlice } from "./features/sessionSlice";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    session: SessionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

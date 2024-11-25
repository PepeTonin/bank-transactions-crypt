import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { LoggedUser, ReqUserSignup, ReqUserLogin } from "@/types/user";

import { post } from "@/utils/api";

interface IAuthSlice {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user: LoggedUser | undefined;
}

export interface AuthReq {
  data: string;
  iv: string;
  sessionId: string;
}

const initialState: IAuthSlice = {
  isAuthenticated: false,
  isAuthenticating: false,
  user: undefined,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: AuthReq, thunkAPI) => {
    return await post("/login", JSON.stringify(payload));
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (user: ReqUserSignup, thunkAPI) => {
    return await post("/signup", JSON.stringify(user));
  }
);

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setUser: (state, action: PayloadAction<LoggedUser>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
      state.isAuthenticating = false;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isAuthenticating = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.isAuthenticating = false;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
      state.isAuthenticating = false;
    });
    builder.addCase(signup.pending, (state, action) => {
      state.isAuthenticating = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.isAuthenticating = false;
    });
  },
});

export default AuthSlice.reducer;

export const { setIsAuthenticated, setIsAuthenticating, setUser } = AuthSlice.actions;

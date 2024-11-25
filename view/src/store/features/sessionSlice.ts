import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { post } from "@/utils/api";
import { decryptSessionKey } from "@/utils/session";

interface InitSessionRequest {
  sessionId: string;
  publicKey: string;
}

interface FulfilledResponse {
  sessionId: string;
  sessionKey: string;
}

interface ISessionSlice {
  sessionId: string | undefined;
  encryptedSessionKey: string | undefined;
  sessionKey: string | undefined;
}

const initialState: ISessionSlice = {
  sessionId: undefined,
  encryptedSessionKey: undefined,
  sessionKey: undefined,
};

export const initSession = createAsyncThunk(
  "session/init",
  async (request: InitSessionRequest, thunkAPI) => {
    return await post("/session", JSON.stringify(request));
  }
);

export const SessionSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setSessionKey: (state, action: PayloadAction<string>) => {
      state.sessionKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      initSession.fulfilled,
      (state, action: PayloadAction<FulfilledResponse>) => {
        if (action.payload) {
          state.encryptedSessionKey = action.payload.sessionKey;
          state.sessionId = action.payload.sessionId;
          state.sessionKey = decryptSessionKey(action.payload.sessionKey);
        }
      }
    );
    builder.addCase(initSession.rejected, (state, action) => {
      state.encryptedSessionKey = undefined;
      state.sessionId = undefined;
    });
  },
});

export default SessionSlice.reducer;

export const { setSessionId, setSessionKey } = SessionSlice.actions;

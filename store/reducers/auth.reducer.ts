import { createReducer } from "@reduxjs/toolkit";
import {
  clearSession,
  setDraftEmail,
  setSession,
  setSessionUser,
} from "../actions/auth.actions";
import { getInitialAuthState } from "../persistence";

const authReducer = createReducer(getInitialAuthState(), (builder) => {
  builder
    .addCase(setSession, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    })
    .addCase(setSessionUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setDraftEmail, (state, action) => {
      state.draftEmail = action.payload;
    })
    .addCase(clearSession, (state) => {
      state.token = null;
      state.user = null;
    });
});

export default authReducer;

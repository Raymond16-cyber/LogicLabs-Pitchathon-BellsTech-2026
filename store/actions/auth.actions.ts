import { createAction } from "@reduxjs/toolkit";
import type { AuthSessionUser } from "../types";

export const setSession = createAction<{
  token: string;
  user: AuthSessionUser;
}>("auth/setSession");
export const setSessionUser = createAction<AuthSessionUser | null>(
  "auth/setSessionUser",
);
export const setDraftEmail = createAction<string>("auth/setDraftEmail");
export const clearSession = createAction("auth/clearSession");

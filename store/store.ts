import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import authReducer from "./reducers/auth.reducer";
import dashboardReducer from "./reducers/dashboard.reducer";
import demoReducer from "./reducers/demo.reducer";
import uiReducer from "./reducers/ui.reducer";
import { persistState } from "./persistence";

export type { AuthSessionUser, DashboardSnapshot } from "./types";
export type {
  DemoState,
  ScanRecord,
  Theme,
  UiState,
  AuthState,
  DashboardState,
} from "./types";
export {
  clearSession,
  setDraftEmail,
  setSession,
  setSessionUser,
} from "./actions/auth.actions";
export {
  resetDashboard,
  setError,
  setLoading,
  setSummary,
} from "./actions/dashboard.actions";
export { hydrateDemo, recordScan } from "./actions/demo.actions";
export { setTheme, toggleTheme } from "./actions/ui.actions";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    demo: demoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

if (typeof window !== "undefined") {
  store.subscribe(() => {
    persistState(store.getState());
  });
}

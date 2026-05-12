import { createReducer } from "@reduxjs/toolkit";
import {
  resetDashboard,
  setError,
  setLoading,
  setSummary,
} from "../actions/dashboard.actions";
import { getInitialDashboardState } from "../persistence";

const dashboardReducer = createReducer(
  getInitialDashboardState(),
  (builder) => {
    builder
      .addCase(setSummary, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(setLoading, (state, action) => {
        state.loading = action.payload;
      })
      .addCase(setError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(resetDashboard, (state) => {
        state.summary = null;
        state.loading = false;
        state.error = null;
      });
  },
);

export default dashboardReducer;

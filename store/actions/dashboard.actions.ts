import { createAction } from "@reduxjs/toolkit";
import type { DashboardSnapshot } from "../types";

export const setSummary = createAction<DashboardSnapshot | null>(
  "dashboard/setSummary",
);
export const setLoading = createAction<boolean>("dashboard/setLoading");
export const setError = createAction<string | null>("dashboard/setError");
export const resetDashboard = createAction("dashboard/resetDashboard");

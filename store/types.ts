import type { AuthSessionUser, DashboardSnapshot } from "../src/services/api";

export type { AuthSessionUser, DashboardSnapshot };

export type Theme = "dark" | "light";
export type ScanStatus = "IN" | "OUT";

export type ScanRecord = {
  name: string;
  id: string;
  status: ScanStatus;
  time: string;
  gate: string;
};

export type UiState = {
  theme: Theme;
};

export type AuthState = {
  token: string | null;
  user: AuthSessionUser | null;
  draftEmail: string;
};

export type DashboardState = {
  summary: DashboardSnapshot | null;
  loading: boolean;
  error: string | null;
};

export type DemoState = {
  scanCount: number;
  scanLog: ScanRecord[];
};

export type PersistedState = {
  ui?: Partial<UiState>;
  auth?: Partial<AuthState>;
  dashboard?: {
    summary?: DashboardSnapshot | null;
  };
  demo?: Partial<DemoState>;
};

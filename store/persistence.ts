import { initialScans } from "../src/content/siteContent";
import type { AuthSessionUser } from "../src/services/api";
import type {
  AuthState,
  DashboardState,
  DemoState,
  PersistedState,
  ScanRecord,
  Theme,
  UiState,
} from "./types";

const PERSISTENCE_KEY = "logic-lab-redux-state";
const LEGACY_THEME_KEY = "logic-lab-theme";
const LEGACY_TOKEN_KEY = "logic-lab-auth-token";
const LEGACY_SESSION_KEY = "logic-lab-auth-session";
const LEGACY_DRAFT_EMAIL_KEY = "logic-lab-auth-draft-email";

const defaultScanLog = initialScans as ScanRecord[];

function readJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readLegacyTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(LEGACY_THEME_KEY);
    return storedTheme === "light"
      ? "light"
      : storedTheme === "dark"
        ? "dark"
        : null;
  } catch {
    return null;
  }
}

function readLegacyAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(LEGACY_TOKEN_KEY);
  } catch {
    return null;
  }
}

function readLegacyAuthUser(): AuthSessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(LEGACY_SESSION_KEY);
    const parsed = readJson<
      Partial<AuthSessionUser> & { university?: AuthSessionUser["university"] }
    >(rawUser);

    if (
      parsed &&
      typeof parsed.id === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      typeof parsed.status === "string"
    ) {
      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        status: parsed.status,
        lastLogin:
          typeof parsed.lastLogin === "string" ? parsed.lastLogin : null,
        university:
          parsed.university &&
          typeof parsed.university === "object" &&
          typeof parsed.university.id === "string" &&
          typeof parsed.university.name === "string" &&
          typeof parsed.university.code === "string"
            ? {
                id: parsed.university.id,
                name: parsed.university.name,
                code: parsed.university.code,
              }
            : null,
      };
    }
  } catch {
    // ignored
  }

  return null;
}

function readLegacyDraftEmail(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(LEGACY_DRAFT_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawState = window.localStorage.getItem(PERSISTENCE_KEY);
  return readJson<PersistedState>(rawState);
}

const persistedState = loadPersistedState() ?? {
  ui: {
    theme: readLegacyTheme() ?? "dark",
  },
  auth: {
    token: readLegacyAuthToken(),
    user: readLegacyAuthUser(),
    draftEmail: readLegacyDraftEmail(),
  },
  dashboard: {
    summary: null,
  },
  demo: {
    scanCount: 0,
    scanLog: defaultScanLog,
  },
};

export function getInitialUiState(): UiState {
  return {
    theme: persistedState.ui?.theme === "light" ? "light" : "dark",
  };
}

export function getInitialAuthState(): AuthState {
  return {
    token: persistedState.auth?.token ?? null,
    user: persistedState.auth?.user ?? null,
    draftEmail: persistedState.auth?.draftEmail ?? "",
  };
}

export function getInitialDashboardState(): DashboardState {
  return {
    summary: persistedState.dashboard?.summary ?? null,
    loading: false,
    error: null,
  };
}

export function getInitialDemoState(): DemoState {
  return {
    scanCount: persistedState.demo?.scanCount ?? 0,
    scanLog: persistedState.demo?.scanLog ?? defaultScanLog,
  };
}

export function persistState(state: {
  ui: UiState;
  auth: AuthState;
  dashboard: Pick<DashboardState, "summary">;
  demo: DemoState;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const nextState: PersistedState = {
    ui: {
      theme: state.ui.theme,
    },
    auth: {
      token: state.auth.token,
      user: state.auth.user,
      draftEmail: state.auth.draftEmail,
    },
    dashboard: {
      summary: state.dashboard.summary,
    },
    demo: {
      scanCount: state.demo.scanCount,
      scanLog: state.demo.scanLog,
    },
  };

  try {
    window.localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(nextState));
  } catch {
    // ignored
  }
}

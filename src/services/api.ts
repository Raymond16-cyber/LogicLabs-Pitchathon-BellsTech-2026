const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string | null;
  university: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export type AuthSessionResponse = {
  token: string;
  user: AuthSessionUser;
};

export type DashboardScanStatus = "IN" | "OUT";

export type DashboardScanRecord = {
  name: string;
  id: string;
  status: DashboardScanStatus;
  time: string;
  gate: string;
};

export type DashboardPanel = {
  title: string;
  value: string;
  description: string;
};

export type DashboardCounters = {
  liveScanTotal: number;
  verifiedEntries: number;
  accessZones: number;
  activeUsers: number;
  responseTime: string;
};

export type DashboardSnapshot = {
  user: AuthSessionUser | null;
  counters: DashboardCounters;
  operationsPanels: DashboardPanel[];
  recentScans: DashboardScanRecord[];
  currentScan: DashboardScanRecord | null;
  connectionState: "connected" | "warming-up";
  recommendedPlanId: "starter" | "pro" | "enterprise";
  lastUpdatedAt: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: AuthSessionUser;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function requestEnvelope<T>(
  path: string,
  options: {
    method?: RequestMethod;
    body?: unknown;
    token?: string;
  } = {},
): Promise<ApiEnvelope<T>> {
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "The server request failed.");
  }

  if (!payload) {
    throw new Error("The server returned an empty response.");
  }

  return payload;
}

export async function loginRequest(payload: {
  email: string;
  password: string;
}) {
  const response = await requestEnvelope<unknown>("/auth/login", {
    method: "POST",
    body: payload,
  });

  if (!response.token || !response.user) {
    throw new Error(response.message || "Login response was incomplete.");
  }

  return {
    token: response.token,
    user: response.user,
    message: response.message || "Signed in successfully.",
  };
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await requestEnvelope<unknown>("/auth/register", {
    method: "POST",
    body: payload,
  });

  if (!response.token || !response.user) {
    throw new Error(response.message || "Register response was incomplete.");
  }

  return {
    token: response.token,
    user: response.user,
    message: response.message || "Account created successfully.",
  };
}

export async function getCurrentUserRequest(token: string) {
  const response = await requestEnvelope<unknown>("/auth/me", {
    token,
  });

  if (!response.user) {
    throw new Error(response.message || "Could not load the current user.");
  }

  return {
    user: response.user,
    message: response.message || "Current user loaded.",
  };
}

export async function getDashboardSummaryRequest(token: string) {
  const response = await requestEnvelope<DashboardSnapshot>(
    "/dashboard/summary",
    {
      token,
    },
  );

  if (!response.data) {
    throw new Error(response.message || "Dashboard summary is unavailable.");
  }

  return response.data;
}

export async function simulateScanRequest(token: string) {
  const response = await requestEnvelope<DashboardSnapshot>(
    "/dashboard/simulate-scan",
    {
      method: "POST",
      token,
    },
  );

  if (!response.data) {
    throw new Error(response.message || "Could not record the simulated scan.");
  }

  return response.data;
}

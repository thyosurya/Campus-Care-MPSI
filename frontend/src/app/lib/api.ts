export type CampusUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "technician" | "admin";
};

type ApiOptions = RequestInit & {
  query?: Record<string, string | number | undefined | null>;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export function getStoredAuth(): { token: string; user: CampusUser } | null {
  const token = localStorage.getItem("campuscare_token");
  const userRaw = localStorage.getItem("campuscare_user");

  if (!token || !userRaw) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(userRaw) as CampusUser,
    };
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: CampusUser): void {
  localStorage.setItem("campuscare_token", token);
  localStorage.setItem("campuscare_user", JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem("campuscare_token");
  localStorage.removeItem("campuscare_user");
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const auth = getStoredAuth();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload
      ? String((payload as { message?: string }).message)
      : "Request gagal.";
    throw new Error(message);
  }

  return payload as T;
}

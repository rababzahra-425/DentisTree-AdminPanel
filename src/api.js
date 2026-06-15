/**
 * Shared API helpers for DentisTree admin frontend.
 * Use localhost (not 127.0.0.1) so session cookies work with Vite on localhost:5173.
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function getCookie(name) {
  if (!document.cookie) return null;
  for (const part of document.cookie.split(";")) {
    const cookie = part.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

/** Fetch CSRF cookie from Django (required before POST with session auth). */
export async function ensureCsrf() {
  if (getCookie("csrftoken")) return;
  try {
    await fetch(`${API_BASE}/auth/csrf/`, { credentials: "include" });
  } catch {
    /* server may be offline */
  }
}

export function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = getCookie("csrftoken");
  if (token) headers["X-CSRFToken"] = token;
  if (!headers["Content-Type"] && !(extra.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

/** Authenticated fetch — always sends session cookies. */
export async function authFetch(path, options = {}) {
  await ensureCsrf();
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = authHeaders(options.headers || {});
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

/** Check if Django session is still valid; returns user object or null. */
export async function fetchCurrentUser() {
  try {
    const res = await authFetch("/auth/me/");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}


//export const API_BASE = import.meta.env.VITE_API_BASE || "/api";
export const API_BASE = "http://127.0.0.1:8000/api";
// Simple token storage helpers (DRF Token auth)
const TOKEN_KEY = "authToken";
export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Core request helper
async function request(method, path, body, { token = getToken(), headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: "omit",
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = typeof data === "object" ? JSON.stringify(data) : `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

// High-level API object
export const api = {
  get: (path, opts) => request("GET", path, null, opts),
  post: (path, body, opts) => request("POST", path, body, opts),
  put: (path, body, opts) => request("PUT", path, body, opts),
  patch: (path, body, opts) => request("PATCH", path, body, opts),
  delete: (path, opts) => request("DELETE", path, null, opts),
};

// ---- Compatibility helpers (optional but handy) ----
export const apiGet = (path, token) => api.get(path, { token });
export const apiPost = (path, body, token) => api.post(path, body, { token });
export const asArray = (data) =>
  Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []);


// Default export (optional)
export default api;

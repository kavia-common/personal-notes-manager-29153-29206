/**
 * Simple API client using fetch with JWT auth.
 * Reads base URL from environment variable REACT_APP_API_BASE_URL.
 * Fallbacks to window.location.origin if not set.
 */

let inMemoryToken = null;

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Set the JWT token in memory and persist to localStorage as a fallback. */
  inMemoryToken = token;
  try {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  } catch (e) {
    // ignore storage errors
  }
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Get JWT token from memory or fallback to localStorage. */
  if (inMemoryToken) return inMemoryToken;
  try {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      inMemoryToken = stored;
      return stored;
    }
  } catch (e) { /* ignore */ }
  return null;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Resolve API base URL from env. */
  const fromEnv = process.env.REACT_APP_API_BASE_URL || import.meta?.env?.VITE_API_BASE_URL;
  return (fromEnv && String(fromEnv)) || `${window.location.origin}`;
}

/**
 * Core request helper with automatic JSON handling and 401 processing.
 */
async function request(path, { method = 'GET', body, headers = {}, requireAuth = true } = {}) {
  const apiBase = getApiBaseUrl().replace(/\/$/, '');
  const url = `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;

  const token = getAuthToken();
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requireAuth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // aligns with typical CORS setups for FastAPI when needed
    mode: 'cors',
  });

  if (res.status === 204) {
    return null;
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (res.status === 401) {
    // Unauthorized - force logout
    setAuthToken(null);
    const evt = new CustomEvent('app:unauthorized');
    window.dispatchEvent(evt);
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed with ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  auth: {
    // PUBLIC_INTERFACE
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, requireAuth: false }),
    // PUBLIC_INTERFACE
    register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password }, requireAuth: false }),
  },
  /** Notes endpoints */
  notes: {
    // PUBLIC_INTERFACE
    list: ({ search = '', page = 1, page_size = 10 } = {}) =>
      request(`/notes?search=${encodeURIComponent(search)}&page=${page}&page_size=${page_size}`, { method: 'GET' }),
    // PUBLIC_INTERFACE
    create: (payload) => request('/notes', { method: 'POST', body: payload }),
    // PUBLIC_INTERFACE
    update: (id, payload) => request(`/notes/${id}`, { method: 'PUT', body: payload }),
    // PUBLIC_INTERFACE
    remove: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  },
};

export default api;

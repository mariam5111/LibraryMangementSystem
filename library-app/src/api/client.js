const BASE = 'http://localhost:8080';

export function getToken() {
  return localStorage.getItem('lib_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('lib_token', token);
  else localStorage.removeItem('lib_token');
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export async function api(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  try {
    return await fetch(BASE + path, { ...opts, headers });
  } catch {
    return { ok: false, status: 0 };
  }
}

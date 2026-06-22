import { API_URL } from '../config.js';

export function logout() {
  localStorage.removeItem("token");
  window.location.hash = "#login";
}

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    logout();
    throw new Error("Sessão expirada");
  }

  return response;
}

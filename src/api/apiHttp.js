const API_URL = "http://127.0.0.1:8000";

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
    localStorage.removeItem("token");
    throw new Error("Sessão expirada");
  }

  return response;
}

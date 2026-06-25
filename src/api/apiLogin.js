const API_URL = "http://127.0.0.1:8000";

export async function apiLogin(username, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Login inválido");
  return response.json();
}

const API_URL = "http://127.0.0.1:8000";

export async function apiCadastro(username, password) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Cadastro inválido");
  return response.json();
}

import { apiLogin } from "../api/apiLogin";
import { useState } from "react";

export function LoginPage({ setIdPage, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setIdPage({ page: "dashboard", id: 0 });
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Login</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button className="form-button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {erro && <p className="form-erro">{erro}</p>}
      <p className="form-link">
        Não tem conta?{" "}
        <span onClick={() => setIdPage({ page: "cadastro", id: 0 })}>
          Cadastre-se
        </span>
      </p>
    </div>
  );
}

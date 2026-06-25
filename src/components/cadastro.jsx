import { apiCadastro } from "../api/apiCadastro";
import { useState } from "react";

export function CadastroPage({ setIdPage }) {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErro("");
    if (password1 !== password2) {
      setErro("Senhas diferentes");
      return;
    }
    setLoading(true);
    try {
      await apiCadastro(username, password1);
      alert("Cadastro feito.");
      setIdPage({ page: "dashboard", id: 0 });
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Cadastro</h1>
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
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Confirmar Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <button className="form-button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
      {erro && <p className="form-erro">{erro}</p>}
    </div>
  );
}

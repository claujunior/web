import { useState } from "react";
import './App.css'
import { CadastroPage } from "./components/cadastro.jsx";
import { LoginPage } from "./components/login.jsx";
import { Navbar } from "./components/navbar.jsx";
import { Dashboard } from "./components/dashboard.jsx";
import { AnimeView } from "./components/anime.jsx";
import { PerfilPage } from "./components/perfil.jsx";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [idPage, setIdPage] = useState({ page: "dashboard", id: 0 });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIdPage({ page: "dashboard", id: 0 });
  };

  const renderPage = () => {
    switch (idPage.page) {
      case "login":
        return <LoginPage setIdPage={setIdPage} setToken={setToken} />;
      case "cadastro":
        return <CadastroPage setIdPage={setIdPage} />;
      case "anime":
        return <AnimeView id={idPage.id} setIdPage={setIdPage} token={token} />;
      case "perfil":
        return <PerfilPage setIdPage={setIdPage} token={token} />;
      default:
        return <Dashboard setIdPage={setIdPage} />;
    }
  };

  return (
    <>
      <Navbar
        setIdPage={setIdPage}
        token={token}
        onLogout={handleLogout}
      />
      {renderPage()}
    </>
  );
}

import { login } from "./api.js";

export function login1() {
  const app = document.getElementById("app");

  app.innerHTML = `
  <form id= "login" class="login">
    <h1>Login</h1>
    <input type="text" id="username" placeholder="Username">
    <input type=password id="password" placeholder="Password">
    <button type="submit">Entrar</button>
    <p id="alerta"></p>
  </form>
`;

  const form = document.getElementById("login");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const alerta = document.getElementById("alerta");
    try {
      const data = await login(username, password);
      console.log(data);
      localStorage.setItem("token", data.access_token);
      alert("login feito.");
      window.location.hash = "#dashboard";
    } catch (err) {
      alerta.textContent = err.message;
    }
  });
}
export function paginaPrincipal() {
  const logado = localStorage.getItem("token");
  const app = document.getElementById("app");

  app.innerHTML = `
<header class="navbar">
  <div class="logo">
    <span class="logo-red">Ani</span>lib
  </div>

  <nav class="menu">
    <a href="#animes" onclick="mostrarAnimes()">Animes</a>
    <a href="#filmes" onclick="mostrarFilmes()">Filmes</a>
    <a href="#pedir-anime" onclick="mostrarPedirAnime()">Pedir Anime</a>
    ${!logado ? `<a href="#login" id="login">Login</a>` : ""}
    ${!logado ? `<a href="#cadastro">Cadastro</a>` : ""}
    ${logado ? `<a id="logout">Logout</a>` : ""}
  </nav>

  <div class="search">
    <input type="text" placeholder="Search...">
  </div>
</header>`;

  const loginBtn = document.getElementById("login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.hash = "#login";
    });
  }

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "#login";
    });
  }
}
export function cadastro() {
  const app = document.getElementById("app");

  app.innerHTML = `
<div class="container"> 
  <div class="cadastro">
    <h1>Cadastro</h1>
    <input id="username" placeholder="Username">
    <input id="password" placeholder="Password">
    <input id="passwordReply" placeholder="Password">
    <button id="btn">Cadastrar</button>
  </div>
</div>`;

  const username1 = document.getElementById("username");
  username1.addEventListener("input", () => {
    console.log(username1.value);
  });

  const password1 = document.getElementById("password");
  const password2 = document.getElementById("passwordReply");

  password2.addEventListener("input", () => {
    if (password1.value !== password2.value) {
      console.log("Senhas diferentes");
    } else {
      console.log("Senhas iguais");
    }
  });

  document.getElementById("btn").addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });
}

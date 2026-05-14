import { login, cadastroapi } from "./api.js";

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
 
  <form id="cadastro" class="cadastro">
    <h1>Cadastro</h1>
    <input type=text id="username" placeholder="Username">
    <input type=password id="password" placeholder="Password">
    <input type=password id="passwordReply" placeholder="Password">
    <button type=submit id="btn">Cadastrar</button>
    <p id="alerta"></p>
  </form>
`;

  const form = document.getElementById("cadastro");
  const password1 = document.getElementById("password");
  const password2 = document.getElementById("passwordReply");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const alerta = document.getElementById("alerta");
    const password1 = document.getElementById("password").value;
    const password2 = document.getElementById("passwordReply").value;
    if (password1 !== password2) {
      alerta.textContent = "Senhas diferentes";
    } else {
      try {
      const data = await cadastroapi(username, password2);
      console.log(data);
      alert("Cadastro feito.");
      window.location.hash = "#dashboard";
      } catch(err) {
        alerta.textContent=err.message
      }
    }
  });
}

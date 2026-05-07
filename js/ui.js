export function login() {
  const app = document.getElementById("app");

  app.innerHTML = `
<div class="container"> 
  <div class="login">
    <h1>Login</h1>
    <input id="username" placeholder="Username">
    <input id="password" placeholder="Password">
    <button id="btn">Entrar</button>
  </div>
</div>`
    ;


     const username1 = document
    .getElementById("username")
    username1.addEventListener("input", () => {
    console.log(username1.value);
  });

  const password1 = document
    .getElementById("password")
    password1.addEventListener("input", () => {
    console.log(password1.value);
  });

  document
  .getElementById("btn")
  .addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });
}
export function paginaPrincipal() {
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
    <a href="#login" id="login">Login</a>
    <a href="#cadastro" onclick="mostrarCadastro()">Cadastro</a>
  </nav>

  <div class="search">
    <input type="text" placeholder="Search...">
  </div>
</header>`
    ;

  document
  .getElementById("login")
  .addEventListener("click", () => {
    window.location.hash = "#login";
  });
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
</div>`
    ;


     const username1 = document
    .getElementById("username")
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

  document
  .getElementById("btn")
  .addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });
}
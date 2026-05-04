export function renderHome() {
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
      outrapagina();
    });
}
export function outrapagina() {
  const app = document.getElementById("app");

  app.innerHTML = `
<header class="navbar">
  <div class="logo">
    <span class="logo-red">Web</span>animes
  </div>

  <nav class="menu">
    <a href="#animes" onclick="mostrarAnimes()">Animes</a>
    <a href="#filmes" onclick="mostrarFilmes()">Filmes</a>
    <a href="#pedir-anime" onclick="mostrarPedirAnime()">Pedir Anime</a>
  </nav>

  <div class="search">
    <input type="text" placeholder="Search...">
  </div>
</header>`
    ;
}
   
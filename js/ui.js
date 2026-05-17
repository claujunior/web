import { login, cadastroapi, mostrarAnimes1, searchAnimes } from "./api.js";

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
export async function paginaPrincipal(page = 1) {
  const logado = localStorage.getItem("token");
  const app = document.getElementById("app");
  let animes = [];

  try {
    animes = await mostrarAnimes1(page);
  } catch (err) {
    console.log(err);
  }

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
    <input id="search" type="text" placeholder="Search...">
    <div id="results"></div>
  </div>
</header>

<main id="conteudo">
<h1 id="recentes">Animes recentes:</h1>
  <div class="animes">
    ${animes
      .map(
        (anime) => `
      <div class="card">
        <img src="${anime.node.main_picture.medium}">
        <h3>${anime.node.title}</h3>
      </div>
    `,
      )
      .join("")}
  </div>

  <div class="paginacao">
    <button id="prev">Anterior</button>
    <button id="next">Próxima</button>
  </div>
</main>`;

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
  document.getElementById("next").addEventListener("click", () => {
    paginaPrincipal(page + 1);
  });
  document.getElementById("prev").addEventListener("click", () => {
    if (page === 1) {
    } else {
      paginaPrincipal(page - 1);
    }
  });

  const pesquisa = document.getElementById("search");
  const resultados = document.getElementById("results");
  pesquisa.addEventListener("input", async () => {
    if (pesquisa.value.length>2) {
      try {
        const data = await searchAnimes(pesquisa.value);
        resultados.innerHTML = data
          .map((anime) => {
            return `
           <img src="${anime.node.main_picture.medium}">
           <h3>${anime.node.title}</h3>
        `;
          })
          .join("");
      } catch (err) {
        console.log(err);
      }
    } else {
       resultados.innerHTML = "";
    }
  });
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
      } catch (err) {
        alerta.textContent = err.message;
      }
    }
  });
}

import { mostrarAnimes1, searchAnimes } from "../api/animes.js";
import { getUsers } from "../api/users.js";
import { logout } from "../api/http.js";

export async function paginaPrincipal(page = 1) {
  const logado = localStorage.getItem("token");
  const app = document.getElementById("app");
  let animes = [];

  if (logado) {
    getUsers().catch(() => {});
  }

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
    <a href="#animes" >Animes</a>
    <a href="#filmes" >Filmes</a>
    <a href="#pedir-anime">Pedir Anime</a>
    ${logado ? `<a href="#perfil">Perfil</a>` : ""}
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
    ${(Array.isArray(animes) ? animes : [])
      .map(
        (anime) => `
      <a href="#anime/${anime.node.id}" class="card">
        ${anime.node.main_picture?.medium ? `<img src="${anime.node.main_picture.medium}">` : ''}
        <h3>${anime.node.title}</h3>
      </a>
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
    logoutBtn.addEventListener("click", logout);
  }

  document.getElementById("next").addEventListener("click", () => {
    paginaPrincipal(page + 1);
  });
  document.getElementById("prev").addEventListener("click", () => {
    if (page > 1) paginaPrincipal(page - 1);
  });

  const pesquisa = document.getElementById("search");
  const resultados = document.getElementById("results");
  let buscaTimer;
  let buscaSeq = 0;
  pesquisa.addEventListener("input", () => {
    clearTimeout(buscaTimer);
    const termo = pesquisa.value;
    if (termo.length <= 2) {
      resultados.innerHTML = "";
      return;
    }
    buscaTimer = setTimeout(async () => {
      const seq = ++buscaSeq;
      try {
        const data = await searchAnimes(termo);
        if (seq !== buscaSeq) return; // resposta obsoleta -> ignora
        resultados.innerHTML = data
          .map((anime) => `
            <a href="#anime/${anime.node.id}" class="anime-link">
              <div class="anime-item">
                ${anime.node.main_picture?.medium ? `<img src="${anime.node.main_picture.medium}">` : ""}
                <h3>${anime.node.title}</h3>
              </div>
            </a>
          `)
          .join("");
      } catch (err) {
        if (seq === buscaSeq) resultados.innerHTML = "";
      }
    }, 300);
  });
}

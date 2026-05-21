import { searchId, searchAnimes } from "../api/animes.js";
export async function paginaAnime(animeId) {
  const logado = localStorage.getItem("token");
  const app = document.getElementById("app");
  let animeInfo = [];
  try {
    animeInfo = await searchId(animeId)
  } catch (error) {
    console.log(error)
  }

  console.log(animeInfo);

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
  const pesquisa = document.getElementById("search");
  const resultados = document.getElementById("results");
  pesquisa.addEventListener("input", async () => {
    if (pesquisa.value.length > 2) {
      try {
        const data = await searchAnimes(pesquisa.value);
        resultados.innerHTML = data
          .map(
            (anime) => `
              <div class="anime-item">
                <img src="${anime.node.main_picture.medium}">
                <h3>${anime.node.title}</h3>
              </div>
            `,
          )
          .join("");
      } catch (err) {
        resultados.innerHTML = "";
      }
    } else {
      resultados.innerHTML = "";
    }
  });
}

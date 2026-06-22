import { searchId, searchAnimes } from "../api/animes.js";
import { logout } from "../api/http.js";
import { malStatus, updateList } from "../api/mal.js";

const STATUS_OPTIONS = [
  ["watching", "Assistindo"],
  ["completed", "Completo"],
  ["on_hold", "Em espera"],
  ["dropped", "Abandonado"],
  ["plan_to_watch", "Planejo assistir"],
];

async function montarWatchlist(animeId) {
  const logado = localStorage.getItem("token");
  if (!logado) return;

  let conectado = false;
  try {
    conectado = (await malStatus()).connected;
  } catch {
    return;
  }
  if (!conectado) return;

  const info = document.querySelector(".anime-info");
  if (!info) return;

  const box = document.createElement("div");
  box.className = "watchlist-box";
  box.innerHTML = `
    <h3>Adicionar à lista</h3>
    <select id="wl-status">
      ${STATUS_OPTIONS.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}
    </select>
    <input id="wl-score" type="number" min="0" max="10" placeholder="Nota">
    <input id="wl-eps" type="number" min="0" placeholder="Episódios">
    <button id="wl-save" class="mal-btn">Salvar</button>
    <span id="wl-msg"></span>`;
  info.appendChild(box);

  document.getElementById("wl-save").addEventListener("click", async () => {
    const msg = document.getElementById("wl-msg");
    const body = { status: document.getElementById("wl-status").value };
    const score = document.getElementById("wl-score").value;
    const eps = document.getElementById("wl-eps").value;
    if (score) body.score = Number(score);
    if (eps) body.num_watched_episodes = Number(eps);

    try {
      await updateList(animeId, body);
      msg.textContent = "Salvo!";
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}
export async function paginaAnime(animeId) {
  const logado = localStorage.getItem("token");
  const app = document.getElementById("app");
  let anime = {};
  try {
    anime = await searchId(animeId)
  } catch (error) {
    console.log(error)
  }

  console.log(anime);

  app.innerHTML = `
<header class="navbar">
  <div class="logo">
    <span class="logo-red">Ani</span>lib
  </div>

  <nav class="menu">
    <a href="#animes" >Animes</a>
    <a href="#filmes" >Filmes</a>
    <a href="#pedir-anime" >Pedir Anime</a>
    ${logado ? `<a href="#perfil">Perfil</a>` : ""}
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
    logoutBtn.addEventListener("click", logout);
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
            <a href="#anime/${anime.node.id}" class="anime-link">
              <div class="anime-item">
                ${anime.node.main_picture?.medium ? `<img src="${anime.node.main_picture.medium}">` : ""}
                <h3>${anime.node.title}</h3>
              </div>
              </a>
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
  
  const content = document.createElement("content");
  content.innerHTML = `
  <main id="conteudo">

  <div class="anime-page">

    <div class="anime-banner">
      ${
        anime.pictures?.map(
          (picture) => `
            <img src="${picture.large}">
          `
        ).join("") || ""
      }
    </div>

    <div class="anime-content">

      <div class="anime-poster">
        <img 
          src="${anime.pictures?.[0]?.large || anime.main_picture?.large}" 
          alt="${anime.title}"
        >
      </div>

      <div class="anime-info">

        <h1>${anime.title}</h1>

        <div class="anime-meta">
          <span>⭐ ${anime.mean || "N/A"}</span>
          <span>🏆 #${anime.rank || "N/A"}</span>
          <span>🔥 #${anime.popularity || "N/A"}</span>
          <span>📺 ${anime.status || "Unknown"}</span>
        </div>

        <div class="genres">
          ${
            anime.genres?.map(
              g => `
                <span class="genre">${g.name}</span>
              `
            ).join("") || ""
          }
        </div>

        <p class="synopsis">
          ${anime.synopsis || "No synopsis available"}
        </p>

        <div class="details">

          <div class="detail-card">
            <h3>Japanese</h3>
            <p>${anime.alternative_titles?.ja || "Unknown"}</p>
          </div>

          <div class="detail-card">
            <h3>English</h3>
            <p>${anime.alternative_titles?.en || "Unknown"}</p>
          </div>

          <div class="detail-card">
            <h3>Source</h3>
            <p>${anime.source || "Unknown"}</p>
          </div>

          <div class="detail-card">
            <h3>Episodes</h3>
            <p>${anime.num_episodes || "Airing"}</p>
          </div>

          <div class="detail-card">
            <h3>Season</h3>
            <p>
              ${anime.start_season?.season || "Unknown"} 
              ${anime.start_season?.year || ""}
            </p>
          </div>

          <div class="detail-card">
            <h3>Broadcast</h3>
            <p>
              ${anime.broadcast?.day_of_the_week || "Unknown"} 
              ${anime.broadcast?.start_time || ""}
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>

</main>
  `;
  app.appendChild(content);

  montarWatchlist(animeId);
}

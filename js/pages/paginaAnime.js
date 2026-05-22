import { searchId, searchAnimes } from "../api/animes.js";
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
            <a href="#anime/${anime.node.id}" class="anime-link">
              <div class="anime-item">
                <img src="${anime.node.main_picture.medium}">
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
}

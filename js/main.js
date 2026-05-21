import { loginPage } from "./pages/login.js";
import { paginaPrincipal } from "./pages/dashboard.js";
import { cadastro } from "./pages/cadastro.js";

function router() {
  const path = window.location.hash;

  if (path === "#login") {
    loginPage();
  } else if (path === "#dashboard") {
    paginaPrincipal();
  } else if (path === "#cadastro") {
    cadastro();
  } else if (path.startsWith("#anime/")) {
    const animeId = path.split("/")[1]; // pega o ID do #anime/1234
    paginaAnime(animeId);
  } else {
    paginaPrincipal();
  }
}

router();

window.addEventListener("hashchange", router);

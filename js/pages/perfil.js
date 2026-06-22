import { malStatus, connectMal, disconnectMal, getAnimelist, removeFromList } from "../api/mal.js";
import { logout } from "../api/http.js";

const STATUS_LABELS = {
  watching: "Assistindo",
  completed: "Completo",
  on_hold: "Em espera",
  dropped: "Abandonado",
  plan_to_watch: "Planejo assistir",
};

const GRUPOS = [
  { titulo: "Minha watchlist", status: ["watching", "plan_to_watch"] },
  { titulo: "Já assistidos", status: ["completed"] },
  { titulo: "Em espera / abandonados", status: ["on_hold", "dropped"] },
];

function nomeUsuario(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).sub;
  } catch {
    return "Usuário";
  }
}

export async function perfil() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.hash = "#login";
    return;
  }

  const app = document.getElementById("app");

  app.innerHTML = `
<header class="navbar">
  <div class="logo"><span class="logo-red">Ani</span>lib</div>
  <nav class="menu">
    <a href="#dashboard">Animes</a>
    <a href="#perfil">Perfil</a>
    <a id="logout">Logout</a>
  </nav>
</header>

<main id="conteudo">
  <section class="perfil">
    <h1>Olá, ${nomeUsuario(token)}</h1>
    <div id="mal-card" class="mal-card">Carregando...</div>
  </section>

  <div id="listas"></div>
</main>`;

  document.getElementById("logout").addEventListener("click", logout);

  const card = document.getElementById("mal-card");

  let status;
  try {
    status = await malStatus();
  } catch (err) {
    card.textContent = err.message;
    return;
  }

  if (!status.connected) {
    card.innerHTML = `
      <p>Conecte sua conta do MyAnimeList para ver e editar sua watchlist.</p>
      <button id="connect" class="mal-btn">Conectar MAL</button>`;
    document.getElementById("connect").addEventListener("click", () => connectMal());
    return;
  }

  card.innerHTML = `
    <p>Conectado como <strong>${status.mal_username || "conta MAL"}</strong></p>
    <button id="disconnect" class="mal-btn ghost">Desconectar</button>`;
  document.getElementById("disconnect").addEventListener("click", async () => {
    await disconnectMal();
    perfil();
  });

  carregarListas();
}

function cardItem(item) {
  const node = item.node;
  const st = item.list_status?.status;
  return `
    <div class="card">
      <a href="#anime/${node.id}">
        ${node.main_picture?.medium ? `<img src="${node.main_picture.medium}">` : ""}
        <h3>${node.title}</h3>
      </a>
      <span class="tag">${STATUS_LABELS[st] || st || ""}</span>
      <button class="mal-btn ghost remove" data-id="${node.id}">Remover</button>
    </div>`;
}

async function carregarListas() {
  const container = document.getElementById("listas");

  let lista;
  try {
    lista = await getAnimelist();
  } catch (err) {
    container.innerHTML = `<p style="padding:0 2rem">${err.message}</p>`;
    return;
  }

  const itens = Array.isArray(lista.data) ? lista.data : [];
  if (itens.length === 0) {
    container.innerHTML = `<p style="padding:0 2rem">Sua lista está vazia.</p>`;
    return;
  }

  container.innerHTML = GRUPOS.map((grupo) => {
    const doGrupo = itens.filter((i) => grupo.status.includes(i.list_status?.status));
    if (doGrupo.length === 0) return "";
    return `
      <section class="watchlist">
        <h2>${grupo.titulo}</h2>
        <div class="animes">${doGrupo.map(cardItem).join("")}</div>
      </section>`;
  }).join("");

  container.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await removeFromList(btn.dataset.id);
        carregarListas();
      } catch {
        btn.disabled = false;
      }
    });
  });
}

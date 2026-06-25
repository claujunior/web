const API_URL = "http://127.0.0.1:8000";

export async function fetchAnimes(page = 1) {
  const response = await fetch(`${API_URL}/anime?page=${page}`);
  if (!response.ok) throw new Error("Erro ao buscar animes");
  const data = await response.json();
  return data.data;
}

export async function fetchTopAnimes() {
  const response = await fetch(`${API_URL}/anime/topanimes`);
  if (!response.ok) throw new Error("Erro ao buscar top animes");
  const data = await response.json();
  return data.data;
}

export async function searchAnimes(query) {
  const response = await fetch(`${API_URL}/anime/search?search=${query}`);
  if (!response.ok) throw new Error("Erro na busca");
  const data = await response.json();
  return data.data;
}

export async function searchId(id) {
  const response = await fetch(`${API_URL}/anime/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar anime");
  return response.json();
}

export async function fetchEpisodes(animeId, lang = "sub") {
  const response = await fetch(`${API_URL}/anime/${animeId}/episodes?lang=${lang}`);
  if (!response.ok) throw new Error("Não foi possível listar os episódios");
  return response.json();
}

export async function fetchStream(animeId, episode, lang = "sub") {
  const response = await fetch(
    `${API_URL}/anime/${animeId}/episodes/${episode}/stream?lang=${lang}`
  );
  if (!response.ok) throw new Error("Não foi possível carregar este episódio");
  return response.json();
}

export function getStreamUrl(animeId, episode, lang = "sub") {
  return `${API_URL}/anime/${animeId}/episodes/${episode}/video?lang=${lang}`;
}

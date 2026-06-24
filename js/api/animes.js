import { API_URL } from '../config.js';

export async function mostrarAnimes1(page = 1) {
    const response = await fetch(`${API_URL}/anime?page=${page}`);

    if (!response.ok) throw new Error("Erro ao buscar animes");
    const data = await response.json();
    return data.data;
}
export async function top10animes(page = 1) {
    const response = await fetch(`${API_URL}/anime/topanimes`);

    if (!response.ok) throw new Error("Erro ao buscar animes");
    const data = await response.json();
    return data.data;
}

export async function searchAnimes(pesquisa) {
    const response = await fetch(`${API_URL}/anime/search?search=${pesquisa}`);

    if (!response.ok) throw new Error("Erro ao buscar animes");
    const data = await response.json();
    return data.data;
}
export async function searchId(id) {
    const response = await fetch(`${API_URL}/anime/${id}`);

    if (!response.ok) throw new Error("Erro ao buscar animes");
    const data = await response.json();
    return data;
}

export async function getStream(animeId, episode, lang = "sub") {
    const response = await fetch(
        `${API_URL}/anime/${animeId}/episodes/${episode}/stream?lang=${lang}`
    );

    if (!response.ok) throw new Error("Não foi possível carregar este episódio");
    return await response.json();
}

// URL do proxy de vídeo no backend (usada como src do <video>)
export function streamProxyUrl(animeId, episode, lang = "sub") {
    return `${API_URL}/anime/${animeId}/episodes/${episode}/video?lang=${lang}`;
}

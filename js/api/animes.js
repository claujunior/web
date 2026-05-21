import { API_URL } from '../config.js';

export async function mostrarAnimes1(page = 1) {
    const response = await fetch(`${API_URL}/anime?page=${page}`);

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

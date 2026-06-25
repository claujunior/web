export const API_URL = 'http://127.0.0.1:8000';

// NSFW ligado por padrão; pode ser desligado pelo switch do navbar.
export function nsfwEnabled() {
    return localStorage.getItem("nsfw") !== "0";
}

export function setNsfwEnabled(on) {
    localStorage.setItem("nsfw", on ? "1" : "0");
}

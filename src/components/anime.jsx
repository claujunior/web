import { searchId, fetchEpisodes, fetchStream, getStreamUrl } from "../api/apiAnimes";
import { malStatus, updateList } from "../api/apiMal";
import { useState, useEffect } from "react";

const CHUNK = 100;

const STATUS_OPTIONS = [
  ["watching", "Assistindo"],
  ["completed", "Completo"],
  ["on_hold", "Em espera"],
  ["dropped", "Abandonado"],
  ["plan_to_watch", "Planejo assistir"],
];

// ── Player de episódios ───────────────────────────────────────────────────────

function EpisodePlayer({ animeId }) {
  const [episodes, setEpisodes] = useState([]);
  const [msg, setMsg] = useState("Carregando episódios...");
  const [activeEp, setActiveEp] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [rangeStart, setRangeStart] = useState(0);

  useEffect(() => {
    fetchEpisodes(animeId)
      .then((data) => {
        const eps = data.episodes || [];
        if (!eps.length) setMsg("Nenhum episódio disponível neste provedor.");
        else {
          setEpisodes(eps);
          setMsg("");
        }
      })
      .catch(() => setMsg("Não foi possível carregar os episódios."));
  }, [animeId]);

  const tocar = async (ep) => {
    setActiveEp(ep);
    setMsg(`Carregando episódio ${ep}...`);
    try {
      const stream = await fetchStream(animeId, ep);
      if (stream.type === "hls") {
        setMsg("Este episódio é HLS (.m3u8) — ainda não suportado no player.");
        return;
      }
      setVideoSrc(getStreamUrl(animeId, ep));
      setMsg(`Episódio ${ep} · ${stream.resolution}p`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const slice = episodes.slice(rangeStart, rangeStart + CHUNK);
  const ranges = [];
  for (let i = 0; i < episodes.length; i += CHUNK) ranges.push(i);

  return (
    <div className="player-box">
      <h3>Assistir</h3>
      {videoSrc && (
        <video
          controls
          src={videoSrc}
          className="anime-player"
        />
      )}
      {msg && <p className="player-msg">{msg}</p>}

      {ranges.length > 1 && (
        <div className="ep-controls">
          <label>
            Faixa:{" "}
            <select
              value={rangeStart}
              onChange={(e) => setRangeStart(Number(e.target.value))}
            >
              {ranges.map((i) => (
                <option key={i} value={i}>
                  {episodes[i]} – {episodes[Math.min(i + CHUNK, episodes.length) - 1]}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {episodes.length > 0 && (
        <div className="episodes-grid">
          {slice.map((ep) => (
            <button
              key={ep}
              className={`ep-btn${activeEp === ep ? " ativo" : ""}`}
              onClick={() => tocar(ep)}
            >
              {ep}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Watchlist box ─────────────────────────────────────────────────────────────

function WatchlistBox({ animeId, token }) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("watching");
  const [score, setScore] = useState("");
  const [eps, setEps] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    malStatus()
      .then((s) => setConnected(s.connected))
      .catch(() => {});
  }, [token]);

  if (!token || !connected) return null;

  const salvar = async () => {
    const body = { status };
    if (score) body.score = Number(score);
    if (eps) body.num_watched_episodes = Number(eps);
    try {
      await updateList(animeId, body);
      setMsg("Salvo!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="watchlist-box">
      <h3>Adicionar à lista</h3>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUS_OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        max={10}
        placeholder="Nota"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <input
        type="number"
        min={0}
        placeholder="Episódios"
        value={eps}
        onChange={(e) => setEps(e.target.value)}
      />
      <button className="mal-btn" onClick={salvar}>Salvar</button>
      {msg && <span className="wl-msg">{msg}</span>}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export function AnimeView({ id, setIdPage, token }) {
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    if (!id) return;
    searchId(id)
      .then(setAnime)
      .catch(console.error);
  }, [id]);

  if (!anime) {
    return <p style={{ color: "var(--text-secondary)", padding: "2rem" }}>Carregando...</p>;
  }

  return (
    <main id="conteudo">
      <div className="anime-page">

        {/* Banner */}
        <div className="anime-banner">
          {anime.pictures?.map((picture) => (
            <img key={picture.large} src={picture.large} alt={anime.title} />
          ))}
        </div>

        {/* Conteúdo */}
        <div className="anime-content">

          {/* Poster */}
          <div className="anime-poster">
            <img
              src={anime.pictures?.[0]?.large || anime.main_picture?.large}
              alt={anime.title}
            />
          </div>

          {/* Info */}
          <div className="anime-info">
            <h1>{anime.title}</h1>

            <div className="anime-meta">
              <span>⭐ {anime.mean || "N/A"}</span>
              <span>🏆 #{anime.rank || "N/A"}</span>
              <span>🔥 #{anime.popularity || "N/A"}</span>
              <span>📺 {anime.status || "Unknown"}</span>
            </div>

            <div className="genres">
              {anime.genres?.map((g) => (
                <span key={g.id} className="genre">{g.name}</span>
              ))}
            </div>

            <p className="synopsis">
              {anime.synopsis || "Sem sinopse disponível."}
            </p>

            <div className="details">
              <div className="detail-card">
                <h3>Japanese</h3>
                <p>{anime.alternative_titles?.ja || "Unknown"}</p>
              </div>
              <div className="detail-card">
                <h3>English</h3>
                <p>{anime.alternative_titles?.en || "Unknown"}</p>
              </div>
              <div className="detail-card">
                <h3>Source</h3>
                <p>{anime.source || "Unknown"}</p>
              </div>
              <div className="detail-card">
                <h3>Episodes</h3>
                <p>{anime.num_episodes || "Airing"}</p>
              </div>
              <div className="detail-card">
                <h3>Season</h3>
                <p>
                  {anime.start_season?.season || "Unknown"}{" "}
                  {anime.start_season?.year || ""}
                </p>
              </div>
              <div className="detail-card">
                <h3>Broadcast</h3>
                <p>
                  {anime.broadcast?.day_of_the_week || "Unknown"}{" "}
                  {anime.broadcast?.start_time || ""}
                </p>
              </div>
            </div>

            <EpisodePlayer animeId={id} />
            <WatchlistBox animeId={id} token={token} />
          </div>

        </div>
      </div>
    </main>
  );
}

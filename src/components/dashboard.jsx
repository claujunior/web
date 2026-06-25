import { fetchAnimes, fetchTopAnimes } from "../api/apiAnimes";
import { useState, useEffect, useCallback } from "react";

function AnimeCard({ anime, onClick }) {
  return (
    <button className="anime-link" onClick={onClick}>
      <div className="card">
        <img
          src={anime.node.main_picture?.medium}
          alt={anime.node.title}
        />
        <h3>{anime.node.title}</h3>
      </div>
    </button>
  );
}

export function Dashboard({ setIdPage }) {
  const [animes, setAnimes] = useState([]);
  const [topAnimes, setTopAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const carregarAnimes = useCallback(async (p) => {
    setLoading(true);
    try {
      const [recentes, top] = await Promise.all([
        fetchAnimes(p),
        fetchTopAnimes(),
      ]);
      setAnimes(Array.isArray(recentes) ? recentes : []);
      setTopAnimes(Array.isArray(top) ? top : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAnimes(page);
  }, [page, carregarAnimes]);

  const irAnime = (id) => setIdPage({ page: "anime", id });

  return (
    <main className="main">
      <h1 className="section-title">Animes recentes:</h1>
      {loading ? (
        <p style={{ color: "var(--text-secondary)", padding: "2rem" }}>
          Carregando...
        </p>
      ) : (
        <div className="animes-grid">
          {animes.map((anime) => (
            <AnimeCard
              key={anime.node.id}
              anime={anime}
              onClick={() => irAnime(anime.node.id)}
            />
          ))}
        </div>
      )}

      <div className="paginacao">
        <button
          className="pageBtn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <button className="pageBtn" onClick={() => setPage((p) => p + 1)}>
          Próxima
        </button>
      </div>

      {topAnimes.length > 0 && (
        <>
          <h1 className="section-title" style={{ marginTop: "2rem" }}>
            Top Animes:
          </h1>
          <div className="animes-grid">
            {topAnimes.map((anime) => (
              <AnimeCard
                key={anime.node.id}
                anime={anime}
                onClick={() => irAnime(anime.node.id)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

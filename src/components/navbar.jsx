import { searchAnimes } from "../api/apiAnimes";
import { useState, useEffect, useCallback, useRef } from "react";

export function Navbar({ setIdPage, token, onLogout }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const timerRef = useRef(null);
  const seqRef = useRef(0);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(timerRef.current);

    if (val.length <= 2) {
      setSearchResults([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const seq = ++seqRef.current;
      try {
        const data = await searchAnimes(val);
        if (seq !== seqRef.current) return;
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        if (seq === seqRef.current) setSearchResults([]);
      }
    }, 300);
  };

  const handleSelectAnime = (id) => {
    setIdPage({ page: "anime", id });
    setQuery("");
    setSearchResults([]);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <span className="logo-red">Ani</span>lib
      </div>

      <nav className="menu">
        <a onClick={() => setIdPage({ page: "dashboard", id: 0 })}>Animes</a>
        {token && (
          <a onClick={() => setIdPage({ page: "perfil", id: 0 })}>Perfil</a>
        )}
        {!token && (
          <a onClick={() => setIdPage({ page: "login", id: 0 })}>Login</a>
        )}
        {!token && (
          <a onClick={() => setIdPage({ page: "cadastro", id: 0 })}>Cadastro</a>
        )}
        {token && <a onClick={onLogout}>Logout</a>}
      </nav>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearchInput}
        />
        {searchResults.length > 0 && query.length > 2 && (
          <div className="results">
            {searchResults.map((anime) => (
              <button
                key={anime.node.id}
                className="anime-link"
                onClick={() => handleSelectAnime(anime.node.id)}
              >
                <div className="anime-item">
                  <img
                    src={anime.node.main_picture?.medium}
                    alt={anime.node.title}
                  />
                  <h3>{anime.node.title}</h3>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

import { useState, useEffect } from "react";
import {
  malStatus,
  connectMal,
  disconnectMal,
  getAnimelist,
  removeFromList,
} from "../api/apiMal";

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

function getUsernameFromToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).sub;
  } catch {
    return "Usuário";
  }
}

// ── Modal de confirmação ──────────────────────────────────────────────────────

function ConfirmModal({ titulo, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Remover da lista?</h3>
        <p className="modal-msg">
          "{titulo}" será removido da sua lista no MyAnimeList.
        </p>
        <div className="modal-actions">
          <button className="mal-btn ghost" onClick={onCancel}>Cancelar</button>
          <button className="mal-btn" onClick={onConfirm}>Remover</button>
        </div>
      </div>
    </div>
  );
}

// ── Card da watchlist ─────────────────────────────────────────────────────────

function WlCard({ item, setIdPage, onRemove }) {
  const node = item.node;
  const label = STATUS_LABELS[item.list_status?.status] || "";

  return (
    <div className="wl-card">
      <div className="wl-poster" onClick={() => setIdPage({ page: "anime", id: node.id })}>
        {node.main_picture?.medium && (
          <img src={node.main_picture.medium} alt={node.title} />
        )}
        {label && <span className="wl-status">{label}</span>}
        <button
          className="wl-remove"
          title="Remover da lista"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(node.id, node.title);
          }}
        >
          ✕
        </button>
      </div>
      <span
        className="wl-title"
        onClick={() => setIdPage({ page: "anime", id: node.id })}
      >
        {node.title}
      </span>
    </div>
  );
}

// ── Página de perfil ──────────────────────────────────────────────────────────

export function PerfilPage({ setIdPage, token }) {
  const [malData, setMalData] = useState(null);
  const [lista, setLista] = useState([]);
  const [loadingMal, setLoadingMal] = useState(true);
  const [modal, setModal] = useState(null); // { id, titulo }

  useEffect(() => {
    if (!token) {
      setIdPage({ page: "login", id: 0 });
      return;
    }
    malStatus()
      .then(setMalData)
      .catch(console.error)
      .finally(() => setLoadingMal(false));
  }, [token]);

  useEffect(() => {
    if (malData?.connected) {
      getAnimelist()
        .then((d) => setLista(Array.isArray(d.data) ? d.data : []))
        .catch(console.error);
    }
  }, [malData]);

  const handleDisconnect = async () => {
    await disconnectMal().catch(console.error);
    const updated = await malStatus().catch(() => ({ connected: false }));
    setMalData(updated);
    setLista([]);
  };

  const handleRemove = (id, titulo) => {
    setModal({ id, titulo });
  };

  const confirmarRemocao = async () => {
    const { id } = modal;
    setModal(null);
    await removeFromList(id).catch(console.error);
    setLista((l) => l.filter((i) => i.node.id !== Number(id)));
  };

  if (!token) return null;

  const st = malData?.mal_statistics;

  return (
    <main className="main">
      <section className="perfil">
        <h1 className="section-title" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          Olá, {getUsernameFromToken(token)}
        </h1>

        <div className="mal-card">
          {loadingMal ? (
            <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
          ) : !malData?.connected ? (
            <>
              <p style={{ color: "var(--text-secondary)" }}>
                Conecte sua conta do MyAnimeList para ver e editar sua watchlist.
              </p>
              <button className="mal-btn" onClick={() => connectMal()}>
                Conectar MAL
              </button>
            </>
          ) : (
            <div className="mal-profile">
              {malData.mal_picture && (
                <img
                  className="mal-avatar"
                  src={malData.mal_picture}
                  alt="avatar"
                />
              )}
              <div className="mal-profile-info">
                <p>
                  Conectado como <strong>{malData.mal_username}</strong>
                </p>
                {st && (
                  <div className="mal-stats">
                    <span><b>{st.num_items_completed ?? 0}</b> completos</span>
                    <span><b>{st.num_episodes ?? 0}</b> episódios</span>
                    <span><b>{st.num_days ?? 0}</b> dias</span>
                  </div>
                )}
                <button className="mal-btn ghost" onClick={handleDisconnect}>
                  Desconectar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Listas por grupo */}
      {GRUPOS.map((grupo) => {
        const items = lista.filter((i) =>
          grupo.status.includes(i.list_status?.status)
        );
        if (!items.length) return null;
        return (
          <section key={grupo.titulo} className="watchlist">
            <h2>{grupo.titulo}</h2>
            <div className="animes-grid">
              {items.map((item) => (
                <WlCard
                  key={item.node.id}
                  item={item}
                  setIdPage={setIdPage}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </section>
        );
      })}

      {modal && (
        <ConfirmModal
          titulo={modal.titulo}
          onConfirm={confirmarRemocao}
          onCancel={() => setModal(null)}
        />
      )}
    </main>
  );
}

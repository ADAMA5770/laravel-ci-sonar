import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { documentsAPI, notificationsAPI } from '../services/api';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .dash-hero {
    background: #002045;
    border-radius: 16px;
    padding: 2.25rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    position: relative;
    overflow: hidden;
  }
  .dash-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(59,130,246,0.18);
    filter: blur(50px);
  }
  .dash-hero-content { position: relative; z-index: 1; }
  .dash-hero-greeting {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
  }
  .dash-hero-title {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;
    line-height: 1.2;
  }
  .dash-hero-title span { color: #60a5fa; }
  .dash-hero-sub { font-size: 0.88rem; color: rgba(255,255,255,0.5); }
  .dash-hero-badge {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 1.25rem 1.75rem;
    text-align: center;
    min-width: 140px;
  }
  .dash-hero-badge-num {
    font-family: 'Manrope', sans-serif;
    font-size: 2.25rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.04em;
  }
  .dash-hero-badge-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.2rem;
  }

  .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.75rem; }
  .dash-stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.35rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: box-shadow 0.2s;
  }
  .dash-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .dash-stat-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dash-stat-icon.blue { background: #eff6ff; }
  .dash-stat-icon.green { background: #f0fdf4; }
  .dash-stat-icon.amber { background: #fffbeb; }
  .dash-stat-num {
    font-family: 'Manrope', sans-serif;
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .dash-stat-label { font-size: 0.78rem; color: #64748b; margin-top: 0.2rem; }

  .dash-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.75rem; }
  .dash-action-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: box-shadow 0.2s, transform 0.15s;
  }
  .dash-action-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .dash-action-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: #eff6ff;
  }
  .dash-action-icon.upload { background: #f0fdf4; }
  .dash-action-title { font-size: 0.92rem; font-weight: 600; color: #0f172a; margin-bottom: 0.15rem; }
  .dash-action-desc { font-size: 0.78rem; color: #64748b; }
  .dash-action-arrow { margin-left: auto; color: #cbd5e1; }

  .dash-section {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
  }
  .dash-section-header {
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f5f9;
  }
  .dash-section-title {
    font-family: 'Manrope', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #0f172a;
  }
  .dash-section-link {
    font-size: 0.8rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }
  .dash-section-link:hover { text-decoration: underline; }

  .dash-doc-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    text-decoration: none;
    transition: background 0.15s;
    border-bottom: 1px solid #f8fafc;
  }
  .dash-doc-item:last-child { border-bottom: none; }
  .dash-doc-item:hover { background: #f8fafc; }
  .dash-doc-left { display: flex; align-items: center; gap: 0.85rem; }
  .dash-doc-file-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dash-doc-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.2rem;
  }
  .dash-doc-badge.cours { background: #eff6ff; color: #2563eb; }
  .dash-doc-badge.TD { background: #fefce8; color: #ca8a04; }
  .dash-doc-badge.examen { background: #fef3c7; color: #d97706; }
  .dash-doc-badge.corrige { background: #f0fdf4; color: #059669; }
  .dash-doc-title { font-size: 0.88rem; font-weight: 500; color: #0f172a; }
  .dash-doc-meta { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }
  .dash-doc-downloads { font-size: 0.78rem; color: #94a3b8; display: flex; align-items: center; gap: 0.3rem; }

  .dash-empty { padding: 3rem 2rem; text-align: center; }
  .dash-empty-text { font-size: 0.9rem; color: #94a3b8; margin-bottom: 0.75rem; }
  .dash-empty-link { font-size: 0.85rem; color: #3b82f6; text-decoration: none; font-weight: 500; }

  @media (max-width: 900px) {
    .dash-stats { grid-template-columns: 1fr 1fr; }
    .dash-hero { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
    .dash-hero-badge { width: 100%; }
  }
  @media (max-width: 640px) {
    .dash-stats { grid-template-columns: 1fr; }
    .dash-actions { grid-template-columns: 1fr; }
  }
`;

const badgeClass = (type) => {
  if (type === 'cours') return 'dash-doc-badge cours';
  if (type === 'TD') return 'dash-doc-badge TD';
  if (type === 'examen') return 'dash-doc-badge examen';
  return 'dash-doc-badge corrige';
};

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalDocuments: 0, recentDocuments: [], myDocCount: 0, myDownloads: 0 });

  useEffect(() => {
    Promise.all([
      documentsAPI.getAll({ sort: 'recent' }),
      user ? documentsAPI.getAll({ user_id: user.id, sort: 'recent' }) : Promise.resolve({ data: { data: [] } }),
    ]).then(([allRes, myRes]) => {
      const myDocs = myRes.data.data || [];
      const myDownloads = myDocs.reduce((sum, d) => sum + (d.nombre_telechargements || 0), 0);
      setStats({
        totalDocuments: allRes.data.total || 0,
        recentDocuments: allRes.data.data?.slice(0, 6) || [],
        myDocCount: myRes.data.total || myDocs.length,
        myDownloads,
      });
    }).catch(console.error);
  }, [user]);

  return (
    <Layout title="Tableau de bord">
      <style>{styles}</style>

      {/* Hero */}
      <div className="dash-hero">
        <div className="dash-hero-content">
          <div className="dash-hero-greeting">Tableau de bord</div>
          <h1 className="dash-hero-title">
            Bienvenue, <span>{user?.prenom}</span>
          </h1>
          <p className="dash-hero-sub">
            {user?.role === 'professeur'
              ? 'Partagez votre savoir avec la communauté'
              : "Continuez votre apprentissage aujourd'hui"}
          </p>
        </div>
        <div className="dash-hero-badge">
          <div className="dash-hero-badge-num">{stats.totalDocuments}</div>
          <div className="dash-hero-badge-label">Documents</div>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="1.8">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <div className="dash-stat-num">{stats.totalDocuments}</div>
            <div className="dash-stat-label">Total documents</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon green">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.8">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <div>
            <div className="dash-stat-num">{stats.myDocCount}</div>
            <div className="dash-stat-label">Mes contributions</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon amber">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="1.8">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </div>
          <div>
            <div className="dash-stat-num">{stats.myDownloads}</div>
            <div className="dash-stat-label">Téléchargements</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="dash-actions">
        <Link to="/documents" className="dash-action-card">
          <div className="dash-action-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="1.8">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div>
            <div className="dash-action-title">Rechercher un cours</div>
            <div className="dash-action-desc">Parcourir tous les documents</div>
          </div>
          <div className="dash-action-arrow">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>
        <Link to="/upload" className="dash-action-card">
          <div className="dash-action-icon upload">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.8">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
          </div>
          <div>
            <div className="dash-action-title">Partager un document</div>
            <div className="dash-action-desc">Aider vos camarades</div>
          </div>
          <div className="dash-action-arrow">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* Recent documents */}
      <div className="dash-section">
        <div className="dash-section-header">
          <span className="dash-section-title">Ajouts récents</span>
          <Link to="/documents" className="dash-section-link">Voir tout</Link>
        </div>
        {stats.recentDocuments.length > 0 ? (
          stats.recentDocuments.map((doc) => (
            <Link key={doc.id} to={`/documents/${doc.id}`} className="dash-doc-item">
              <div className="dash-doc-left">
                <div className="dash-doc-file-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="1.8">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <div className={badgeClass(doc.type_document)}>{doc.type_document}</div>
                  <div className="dash-doc-title">{doc.titre}</div>
                  <div className="dash-doc-meta">{doc.niveau} · {doc.annee}</div>
                </div>
              </div>
              <div className="dash-doc-downloads">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                {doc.nombre_telechargements}
              </div>
            </Link>
          ))
        ) : (
          <div className="dash-empty">
            <div className="dash-empty-text">Aucun document pour le moment</div>
            <Link to="/upload" className="dash-empty-link">Soyez le premier à partager un cours</Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;

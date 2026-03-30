import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsAPI, filieresAPI } from '../services/api';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .docs-header { margin-bottom: 1.75rem; }
  .docs-title {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    margin-bottom: 0.3rem;
  }
  .docs-title span { color: #3b82f6; }
  .docs-subtitle { font-size: 0.88rem; color: #64748b; }

  .docs-filters {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    align-items: flex-end;
  }
  .docs-filter-group { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 140px; }
  .docs-filter-group.wide { flex: 2; min-width: 200px; }
  .docs-filter-label {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .docs-filter-input, .docs-filter-select {
    width: 100%;
    padding: 0.65rem 0.9rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .docs-filter-input:focus, .docs-filter-select:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  .docs-count {
    font-size: 0.82rem;
    color: #64748b;
    margin-bottom: 1.1rem;
  }
  .docs-count strong { color: #0f172a; font-weight: 600; }

  .docs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }

  .doc-card {
    background: #fff;
    border-radius: 12px;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s, transform 0.15s;
    overflow: hidden;
  }
  .doc-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09); transform: translateY(-3px); }

  .doc-card-body { padding: 1.25rem 1.35rem 1rem; flex: 1; }
  .doc-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }

  .doc-badge {
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.22rem 0.6rem;
    border-radius: 5px;
  }
  .doc-badge.cours { background: #eff6ff; color: #2563eb; }
  .doc-badge.TD { background: #fefce8; color: #ca8a04; }
  .doc-badge.examen { background: #fef3c7; color: #d97706; }
  .doc-badge.corrige { background: #f0fdf4; color: #059669; }

  .doc-rating { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; color: #f59e0b; font-weight: 600; }

  .doc-title { font-size: 0.92rem; font-weight: 600; color: #0f172a; margin-bottom: 0.4rem; line-height: 1.4; }
  .doc-desc {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .doc-card-footer {
    padding: 0.75rem 1.35rem;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .doc-meta { font-size: 0.75rem; color: #94a3b8; }
  .doc-downloads { font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 0.3rem; }
  .doc-eye-btn {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    background: #eff6ff;
    border-radius: 6px;
    color: #3b82f6;
    transition: background 0.15s;
    text-decoration: none;
  }
  .doc-eye-btn:hover { background: #dbeafe; }

  .docs-loading { text-align: center; padding: 5rem 2rem; color: #94a3b8; }
  .docs-loading-spinner {
    width: 32px; height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .docs-empty {
    background: #fff;
    border-radius: 12px;
    padding: 4rem 2rem;
    text-align: center;
  }
  .docs-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.3; }
  .docs-empty-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.4rem;
  }
  .docs-empty-text { font-size: 0.85rem; color: #94a3b8; }

  @media (max-width: 1100px) { .docs-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .docs-grid { grid-template-columns: 1fr; } }
`;

const badgeClass = (type) => {
  if (type === 'cours') return 'doc-badge cours';
  if (type === 'TD') return 'doc-badge TD';
  if (type === 'examen') return 'doc-badge examen';
  return 'doc-badge corrige';
};

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', filiere_id: '', type_document: '', niveau: '', sort: 'recent' });

  useEffect(() => {
    filieresAPI.getAll().then(r => setFilieres(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    documentsAPI.getAll(filters)
      .then(r => setDocuments(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <Layout title="Documents">
      <style>{styles}</style>

      <div className="docs-header">
        <h1 className="docs-title">Document Library<span>.</span></h1>
        <p className="docs-subtitle">Parcourez et téléchargez les cours partagés par la communauté</p>
      </div>

      <div className="docs-filters">
        <div className="docs-filter-group wide">
          <span className="docs-filter-label">Recherche</span>
          <input name="search" className="docs-filter-input" placeholder="Titre du document..." value={filters.search} onChange={handleChange} />
        </div>
        <div className="docs-filter-group">
          <span className="docs-filter-label">Filière</span>
          <select name="filiere_id" className="docs-filter-select" value={filters.filiere_id} onChange={handleChange}>
            <option value="">Toutes les filières</option>
            {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
          </select>
        </div>
        <div className="docs-filter-group">
          <span className="docs-filter-label">Type</span>
          <select name="type_document" className="docs-filter-select" value={filters.type_document} onChange={handleChange}>
            <option value="">Tous les types</option>
            <option value="cours">Cours</option>
            <option value="TD">TD</option>
            <option value="examen">Examen</option>
            <option value="corrige">Corrigé</option>
          </select>
        </div>
        <div className="docs-filter-group">
          <span className="docs-filter-label">Niveau</span>
          <select name="niveau" className="docs-filter-select" value={filters.niveau} onChange={handleChange}>
            <option value="">Tous les niveaux</option>
            <option value="L1">L1</option><option value="L2">L2</option>
            <option value="L3">L3</option><option value="M1">M1</option>
            <option value="M2">M2</option><option value="Terminale">Terminale</option>
          </select>
        </div>
        <div className="docs-filter-group">
          <span className="docs-filter-label">Trier par</span>
          <select name="sort" className="docs-filter-select" value={filters.sort} onChange={handleChange}>
            <option value="recent">Plus récents</option>
            <option value="popular">Plus téléchargés</option>
            <option value="rated">Mieux notés</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="docs-loading">
          <div className="docs-loading-spinner" />
          <p>Chargement des documents...</p>
        </div>
      ) : documents.length > 0 ? (
        <>
          <div className="docs-count">
            <strong>{documents.length}</strong> document{documents.length > 1 ? 's' : ''} trouvé{documents.length > 1 ? 's' : ''}
          </div>
          <div className="docs-grid">
            {documents.map(doc => (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="doc-card">
                <div className="doc-card-body">
                  <div className="doc-card-header">
                    <span className={badgeClass(doc.type_document)}>{doc.type_document}</span>
                    <span className="doc-rating">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {doc.notes_avg_note ? Number(doc.notes_avg_note).toFixed(1) : '—'}
                    </span>
                  </div>
                  <div className="doc-title">{doc.titre}</div>
                  <div className="doc-desc">{doc.description || 'Pas de description'}</div>
                </div>
                <div className="doc-card-footer">
                  <div>
                    <div className="doc-meta">{doc.niveau} · {doc.filiere?.nom_filiere || ''}</div>
                    <div className="doc-downloads" style={{marginTop:'0.2rem'}}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      {doc.nombre_telechargements}
                    </div>
                  </div>
                  <div className="doc-eye-btn" onClick={e => e.preventDefault()}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="docs-empty">
          <div className="docs-empty-icon">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth="1.2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div className="docs-empty-title">Aucun document trouvé</div>
          <div className="docs-empty-text">Essayez de modifier vos filtres de recherche</div>
        </div>
      )}
    </Layout>
  );
}

export default Documents;

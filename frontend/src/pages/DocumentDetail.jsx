import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .dd-breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #94a3b8; margin-bottom: 1.5rem; }
  .dd-breadcrumb a { color: #94a3b8; text-decoration: none; transition: color 0.15s; }
  .dd-breadcrumb a:hover { color: #3b82f6; }
  .dd-breadcrumb-sep { opacity: 0.5; }

  .dd-hero {
    background: #002045;
    border-radius: 16px;
    padding: 2rem 2.25rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .dd-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(59,130,246,0.15);
    filter: blur(50px);
  }
  .dd-hero-inner { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
  .dd-hero-left { flex: 1; min-width: 260px; }

  .dd-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.85rem; }
  .dd-badge { font-size: 0.67rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.65rem; border-radius: 5px; }
  .dd-badge.cours { background: rgba(59,130,246,0.25); color: #93c5fd; }
  .dd-badge.TD { background: rgba(245,158,11,0.2); color: #fcd34d; }
  .dd-badge.examen { background: rgba(249,115,22,0.2); color: #fdba74; }
  .dd-badge.corrige { background: rgba(16,185,129,0.2); color: #6ee7b7; }
  .dd-badge-info { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }

  .dd-hero-title { font-family: 'Manrope', sans-serif; font-size: 1.75rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 0.85rem; line-height: 1.25; }
  .dd-hero-meta { display: flex; gap: 1.25rem; flex-wrap: wrap; }
  .dd-hero-meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: rgba(255,255,255,0.5); }

  .dd-hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; }
  .dd-rating-big { text-align: right; }
  .dd-rating-num { font-family: 'Manrope', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -0.04em; }
  .dd-rating-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }

  .dd-download-btn {
    display: flex; align-items: center; gap: 0.5rem;
    background: #3b82f6; color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem; font-weight: 600;
    padding: 0.75rem 1.35rem;
    border-radius: 9px; border: none;
    cursor: pointer; text-decoration: none;
    transition: background 0.15s, transform 0.15s;
  }
  .dd-download-btn:hover { background: #2563eb; transform: translateY(-1px); }
  .dd-download-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .dd-download-btn.done { background: #10b981; }

  .dd-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; }

  .dd-card { background: #fff; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.1rem; }
  .dd-card-title { font-family: 'Manrope', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.06em; }

  .dd-description { font-size: 0.88rem; color: #374151; line-height: 1.7; white-space: pre-line; }
  .dd-no-description { font-size: 0.85rem; color: #94a3b8; font-style: italic; }

  .dd-rating-current { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
  .dd-rating-score { font-family: 'Manrope', sans-serif; font-size: 2.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
  .dd-stars { display: flex; gap: 2px; }
  .dd-star-filled { color: #f59e0b; font-size: 1rem; }
  .dd-star-empty { color: #e2e8f0; font-size: 1rem; }
  .dd-rating-count { font-size: 0.78rem; color: #94a3b8; margin-top: 0.1rem; }
  .dd-rate-label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
  .dd-stars-input { display: flex; gap: 0.25rem; margin-bottom: 0.85rem; }
  .dd-star-btn { background: none; border: none; cursor: pointer; font-size: 1.5rem; padding: 0.1rem; transition: transform 0.15s; line-height: 1; }
  .dd-star-btn:hover { transform: scale(1.2); }
  .dd-rate-btn {
    width: 100%;
    background: #002045; color: #fff;
    border: none; padding: 0.65rem;
    border-radius: 8px; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .dd-rate-btn:hover { background: #3b82f6; }
  .dd-rate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .dd-rate-success { text-align: center; color: #059669; font-size: 0.82rem; margin-top: 0.5rem; font-weight: 500; }

  .dd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .dd-info-item {}
  .dd-info-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 0.2rem; font-weight: 600; }
  .dd-info-value { font-size: 0.88rem; color: #0f172a; font-weight: 500; }

  .dd-author { display: flex; align-items: center; gap: 0.85rem; }
  .dd-author-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #60a5fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.88rem; font-weight: 700; flex-shrink: 0; }
  .dd-author-name { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
  .dd-author-role { font-size: 0.75rem; color: #94a3b8; text-transform: capitalize; margin-top: 0.1rem; }

  .dd-owner-actions { display: flex; gap: 0.65rem; }
  .dd-btn-edit { flex: 1; background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0; padding: 0.6rem; border-radius: 8px; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .dd-btn-edit:hover { background: #dcfce7; }
  .dd-btn-delete { flex: 1; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 0.6rem; border-radius: 8px; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .dd-btn-delete:hover { background: #fee2e2; }

  .dd-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .dd-modal { background: #fff; border-radius: 14px; padding: 1.75rem; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .dd-modal-title { font-family: 'Manrope', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
  .dd-modal-text { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.6; }
  .dd-modal-actions { display: flex; gap: 0.65rem; }
  .dd-modal-cancel { flex: 1; background: #f1f5f9; color: #374151; border: none; padding: 0.65rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; }
  .dd-modal-confirm { flex: 1; background: #dc2626; color: #fff; border: none; padding: 0.65rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .dd-modal-confirm:hover { background: #b91c1c; }

  .dd-loading { min-height: 50vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.75rem; color: #94a3b8; }
  .dd-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) { .dd-grid { grid-template-columns: 1fr; } }
`;

const badgeClass = (type) => {
  const m = { cours: 'cours', TD: 'TD', examen: 'examen', corrige: 'corrige' };
  return `dd-badge ${m[type] || 'cours'}`;
};

const renderStars = (avg) => {
  const filled = Math.round(avg || 0);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < filled ? 'dd-star-filled' : 'dd-star-empty'}>★</span>
  ));
};

function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    documentsAPI.get(id)
      .then(r => setDoc(r.data))
      .catch(() => setError('Document introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const r = await documentsAPI.download(id);
      window.open(r.data.fichier_url, '_blank');
      setDownloadDone(true);
      setDoc(prev => ({ ...prev, nombre_telechargements: (prev.nombre_telechargements || 0) + 1 }));
    } catch { alert('Erreur lors du téléchargement'); }
    finally { setDownloading(false); }
  };

  const handleRate = async () => {
    if (!userRating) return;
    setRatingLoading(true);
    try {
      const r = await documentsAPI.rate(id, userRating);
      setDoc(prev => ({ ...prev, notes_avg_note: r.data.moyenne_notes }));
      setRatingSuccess(true);
      setTimeout(() => setRatingSuccess(false), 3000);
    } catch { alert('Erreur lors de la notation'); }
    finally { setRatingLoading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await documentsAPI.delete(id);
      navigate('/documents');
    } catch { alert('Erreur'); setDeleting(false); }
  };

  const isOwner = user && doc && user.id === doc.user_id;
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (loading) return (
    <Layout title="Document">
      <style>{styles}</style>
      <div className="dd-loading">
        <div className="dd-spinner" />
        <span>Chargement...</span>
      </div>
    </Layout>
  );

  if (error || !doc) return (
    <Layout title="Document introuvable">
      <style>{styles}</style>
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth="1" style={{ marginBottom: '1rem' }}>
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Document introuvable</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Ce document n'existe pas ou a été supprimé.</p>
        <Link to="/documents" style={{ background: '#002045', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
          Retour aux documents
        </Link>
      </div>
    </Layout>
  );

  const authorName = doc.user ? `${doc.user.prenom || ''} ${doc.user.nom || ''}`.trim() : 'Auteur inconnu';
  const avgNote = doc.notes_avg_note ? Number(doc.notes_avg_note).toFixed(1) : null;

  return (
    <Layout title={doc.titre}>
      <style>{styles}</style>

      <div className="dd-breadcrumb">
        <Link to="/dashboard">Accueil</Link>
        <span className="dd-breadcrumb-sep">›</span>
        <Link to="/documents">Documents</Link>
        <span className="dd-breadcrumb-sep">›</span>
        <span style={{ color: '#374151' }}>{doc.titre}</span>
      </div>

      <div className="dd-hero">
        <div className="dd-hero-inner">
          <div className="dd-hero-left">
            <div className="dd-tags">
              <span className={badgeClass(doc.type_document)}>{doc.type_document}</span>
              {doc.niveau && <span className="dd-badge dd-badge-info">{doc.niveau}</span>}
              {doc.filiere && <span className="dd-badge dd-badge-info">{doc.filiere.nom_filiere}</span>}
            </div>
            <h1 className="dd-hero-title">{doc.titre}</h1>
            <div className="dd-hero-meta">
              <span className="dd-hero-meta-item">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {doc.annee}
              </span>
              {avgNote && (
                <span className="dd-hero-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {avgNote} / 5
                </span>
              )}
              <span className="dd-hero-meta-item">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                {doc.nombre_telechargements} téléchargement{doc.nombre_telechargements !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="dd-hero-right">
            {avgNote && (
              <div className="dd-rating-big">
                <div className="dd-rating-num">{avgNote}</div>
                <div className="dd-rating-label">Note moyenne</div>
              </div>
            )}
            <button
              className={`dd-download-btn ${downloadDone ? 'done' : ''}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                {downloadDone
                  ? <path d="M5 13l4 4L19 7"/>
                  : <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>}
              </svg>
              {downloading ? 'Téléchargement...' : downloadDone ? 'Téléchargé !' : 'Télécharger'}
            </button>
          </div>
        </div>
      </div>

      <div className="dd-grid">
        <div>
          <div className="dd-card">
            <div className="dd-card-title">Description</div>
            {doc.description
              ? <p className="dd-description">{doc.description}</p>
              : <p className="dd-no-description">Aucune description fournie pour ce document.</p>}
          </div>

          <div className="dd-card">
            <div className="dd-card-title">Notation</div>
            {avgNote ? (
              <div className="dd-rating-current">
                <div className="dd-rating-score">{avgNote}</div>
                <div>
                  <div className="dd-stars">{renderStars(avgNote)}</div>
                  <div className="dd-rating-count">{doc.notes_count || 0} avis</div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Aucune note pour l'instant. Soyez le premier !</p>
            )}
            <div className="dd-rate-label">Votre note</div>
            <div className="dd-stars-input">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className="dd-star-btn"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(n)}
                >
                  {n <= (hoverRating || userRating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <button className="dd-rate-btn" onClick={handleRate} disabled={!userRating || ratingLoading}>
              {ratingLoading ? 'Envoi...' : userRating ? `Noter ${userRating}/5` : 'Sélectionnez une note'}
            </button>
            {ratingSuccess && <div className="dd-rate-success">Merci pour votre note !</div>}
          </div>
        </div>

        <div>
          <div className="dd-card">
            <div className="dd-card-title">Informations</div>
            <div className="dd-info-grid">
              <div className="dd-info-item"><div className="dd-info-label">Type</div><div className="dd-info-value" style={{ textTransform: 'capitalize' }}>{doc.type_document}</div></div>
              <div className="dd-info-item"><div className="dd-info-label">Niveau</div><div className="dd-info-value">{doc.niveau || '—'}</div></div>
              <div className="dd-info-item"><div className="dd-info-label">Filière</div><div className="dd-info-value">{doc.filiere?.nom_filiere || '—'}</div></div>
              <div className="dd-info-item"><div className="dd-info-label">Année</div><div className="dd-info-value">{doc.annee || '—'}</div></div>
              <div className="dd-info-item"><div className="dd-info-label">Téléchargements</div><div className="dd-info-value">{doc.nombre_telechargements}</div></div>
              <div className="dd-info-item"><div className="dd-info-label">Ajouté le</div><div className="dd-info-value">{doc.created_at ? new Date(doc.created_at).toLocaleDateString('fr-FR') : '—'}</div></div>
            </div>
          </div>

          <div className="dd-card">
            <div className="dd-card-title">Partagé par</div>
            <div className="dd-author">
              <div className="dd-author-avatar">{getInitials(authorName)}</div>
              <div>
                <div className="dd-author-name">{authorName}</div>
                <div className="dd-author-role">{doc.user?.role || 'Étudiant'}</div>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="dd-card">
              <div className="dd-card-title">Actions</div>
              <div className="dd-owner-actions">
                <button className="dd-btn-edit" onClick={() => navigate(`/documents/${id}/edit`)}>Modifier</button>
                <button className="dd-btn-delete" onClick={() => setShowDeleteModal(true)}>Supprimer</button>
              </div>
            </div>
          )}

          <button className="dd-download-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDownload} disabled={downloading}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Télécharger le document
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="dd-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="dd-modal" onClick={e => e.stopPropagation()}>
            <div className="dd-modal-title">Supprimer ce document ?</div>
            <p className="dd-modal-text">Cette action est irréversible. Le document et son fichier seront définitivement supprimés.</p>
            <div className="dd-modal-actions">
              <button className="dd-modal-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="dd-modal-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default DocumentDetail;

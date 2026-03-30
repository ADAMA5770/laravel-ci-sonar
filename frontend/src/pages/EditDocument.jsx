import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { documentsAPI, filieresAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const TYPE_OPTIONS = [
  { value: 'cours', label: 'Cours' },
  { value: 'TD', label: 'TD' },
  { value: 'examen', label: 'Examen' },
  { value: 'corrige', label: 'Corrigé' },
];

function EditDocument() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    titre: '', description: '', type_document: 'cours',
    filiere_id: '', niveau: '', annee: '',
  });

  useEffect(() => {
    Promise.all([documentsAPI.get(id), filieresAPI.getAll()])
      .then(([docRes, filRes]) => {
        const doc = docRes.data;
        if (user && doc.user_id !== user.id) { navigate(`/documents/${id}`); return; }
        setFormData({
          titre: doc.titre || '',
          description: doc.description || '',
          type_document: doc.type_document || 'cours',
          filiere_id: doc.filiere_id ? String(doc.filiere_id) : '',
          niveau: doc.niveau || '',
          annee: doc.annee || '',
        });
        setFilieres(filRes.data);
      })
      .catch(() => navigate('/documents'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.filiere_id) { setError('Veuillez sélectionner une filière'); return; }
    if (!formData.niveau) { setError('Veuillez sélectionner un niveau'); return; }
    setSaving(true);
    try {
      await documentsAPI.update(id, formData);
      setSuccess(true);
      setTimeout(() => navigate(`/documents/${id}`), 1500);
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : null)
        || 'Erreur lors de la modification';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Layout title="Modifier le document">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#94a3b8' }}>
        Chargement...
      </div>
    </Layout>
  );

  return (
    <Layout title="Modifier le document">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .ed-wrap { max-width: 720px; }
        .ed-header { margin-bottom: 1.75rem; }
        .ed-title { font-family: 'Manrope', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 0.3rem; }
        .ed-subtitle { font-size: 0.875rem; color: #64748b; }
        .ed-alert { padding: 0.9rem 1.1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: 0.6rem; }
        .ed-alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .ed-alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .ed-card { background: #fff; border-radius: 14px; overflow: hidden; }
        .ed-card-header { padding: 1.25rem 1.75rem; background: #002045; }
        .ed-card-header-title { font-family: 'Manrope', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
        .ed-card-header-sub { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
        .ed-card-body { padding: 1.75rem; }
        .ed-field { margin-bottom: 1.35rem; }
        .ed-label { display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #64748b; margin-bottom: 0.45rem; }
        .ed-required { color: #ef4444; }
        .ed-input, .ed-select, .ed-textarea {
          width: 100%; padding: 0.75rem 0.9rem;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.88rem;
          color: #0f172a; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ed-textarea { min-height: 90px; resize: vertical; }
        .ed-input:focus, .ed-select:focus, .ed-textarea:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ed-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
        .ed-type-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.7rem; }
        .ed-type-card { padding: 0.85rem 0.6rem; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; text-align: center; background: #f8fafc; transition: all 0.15s; }
        .ed-type-card:hover { border-color: #cbd5e1; background: #fff; }
        .ed-type-card.active { border-color: #3b82f6; background: #eff6ff; }
        .ed-type-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .ed-type-card.active .ed-type-label { color: #2563eb; }
        .ed-divider { border: none; border-top: 1px solid #f1f5f9; margin: 1.25rem 0; }
        .ed-actions { display: flex; gap: 0.85rem; }
        .ed-submit-btn { flex: 1; padding: 0.85rem; background: #002045; color: #fff; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s, transform 0.15s; }
        .ed-submit-btn:hover { background: #3b82f6; transform: translateY(-1px); }
        .ed-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .ed-cancel-link { padding: 0.85rem 1.5rem; background: #f1f5f9; border-radius: 8px; color: #64748b; font-size: 0.88rem; font-weight: 500; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .ed-cancel-link:hover { background: #e2e8f0; color: #374151; }
        @media (max-width:640px) { .ed-row { grid-template-columns: 1fr; } .ed-type-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="ed-wrap">
        <div className="ed-header">
          <h1 className="ed-title">Modifier le document</h1>
          <p className="ed-subtitle">Mettez à jour les informations de votre document</p>
        </div>

        {success && (
          <div className="ed-alert success">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div><strong>Modifications enregistrées !</strong> Redirection...</div>
          </div>
        )}
        {error && (
          <div className="ed-alert error">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>{error}</div>
          </div>
        )}

        <div className="ed-card">
          <div className="ed-card-header">
            <div className="ed-card-header-title">Informations du document</div>
            <div className="ed-card-header-sub">Tous les champs marqués * sont obligatoires</div>
          </div>
          <div className="ed-card-body">
            <form onSubmit={handleSubmit}>
              <div className="ed-field">
                <label className="ed-label">Titre <span className="ed-required">*</span></label>
                <input name="titre" className="ed-input" value={formData.titre} onChange={handleChange} required />
              </div>

              <div className="ed-field">
                <label className="ed-label">Description</label>
                <textarea name="description" className="ed-textarea" value={formData.description} onChange={handleChange} />
              </div>

              <div className="ed-field">
                <label className="ed-label">Type de document <span className="ed-required">*</span></label>
                <div className="ed-type-grid">
                  {TYPE_OPTIONS.map(t => (
                    <div
                      key={t.value}
                      className={`ed-type-card ${formData.type_document === t.value ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, type_document: t.value })}
                    >
                      <div className="ed-type-label">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ed-row">
                <div className="ed-field">
                  <label className="ed-label">Filière <span className="ed-required">*</span></label>
                  <select name="filiere_id" className="ed-select" value={formData.filiere_id} onChange={handleChange} required>
                    <option value="">Sélectionnez une filière</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
                  </select>
                </div>
                <div className="ed-field">
                  <label className="ed-label">Niveau <span className="ed-required">*</span></label>
                  <select name="niveau" className="ed-select" value={formData.niveau} onChange={handleChange} required>
                    <option value="">Sélectionnez un niveau</option>
                    <option value="L1">L1 (Licence 1)</option>
                    <option value="L2">L2 (Licence 2)</option>
                    <option value="L3">L3 (Licence 3)</option>
                    <option value="M1">M1 (Master 1)</option>
                    <option value="M2">M2 (Master 2)</option>
                    <option value="Seconde">Seconde</option>
                    <option value="Premiere">Première</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                </div>
              </div>

              <div className="ed-field">
                <label className="ed-label">Année académique <span className="ed-required">*</span></label>
                <input name="annee" className="ed-input" value={formData.annee} onChange={handleChange} required />
              </div>

              <hr className="ed-divider" />

              <div className="ed-actions">
                <button type="submit" className="ed-submit-btn" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
                <Link to={`/documents/${id}`} className="ed-cancel-link">Annuler</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditDocument;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { documentsAPI, filieresAPI } from '../services/api';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .up-wrap { max-width: 720px; }

  .up-header { margin-bottom: 1.75rem; }
  .up-title { font-family: 'Manrope', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 0.3rem; }
  .up-subtitle { font-size: 0.875rem; color: #64748b; }

  .up-alert { padding: 0.9rem 1.1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: 0.6rem; }
  .up-alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
  .up-alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

  .up-card { background: #fff; border-radius: 14px; overflow: hidden; }
  .up-card-header { padding: 1.25rem 1.75rem; background: #002045; }
  .up-card-header-title { font-family: 'Manrope', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
  .up-card-header-sub { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
  .up-card-body { padding: 1.75rem; }

  .up-field { margin-bottom: 1.35rem; }
  .up-label { display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #64748b; margin-bottom: 0.45rem; }
  .up-required { color: #ef4444; }
  .up-input, .up-select, .up-textarea {
    width: 100%;
    padding: 0.75rem 0.9rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .up-textarea { min-height: 90px; resize: vertical; }
  .up-input:focus, .up-select:focus, .up-textarea:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  .up-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }

  .up-type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.7rem; }
  .up-type-card {
    padding: 0.9rem 0.6rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    background: #f8fafc;
    transition: all 0.15s;
  }
  .up-type-card:hover { border-color: #cbd5e1; background: #fff; }
  .up-type-card.active { border-color: #3b82f6; background: #eff6ff; }
  .up-type-icon { margin-bottom: 0.35rem; }
  .up-type-label { font-size: 0.78rem; font-weight: 600; color: #374151; }
  .up-type-card.active .up-type-label { color: #2563eb; }

  .up-dropzone {
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    padding: 2.25rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: #f8fafc;
  }
  .up-dropzone:hover, .up-dropzone.has-file { border-color: #3b82f6; background: #eff6ff; }
  .up-dropzone-icon { margin-bottom: 0.65rem; color: #94a3b8; }
  .up-dropzone.has-file .up-dropzone-icon { color: #3b82f6; }
  .up-dropzone-title { font-size: 0.9rem; font-weight: 600; color: #374151; margin-bottom: 0.2rem; }
  .up-dropzone-sub { font-size: 0.78rem; color: #94a3b8; }
  .up-file-name { margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.4rem; background: #fff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.4rem 0.8rem; font-size: 0.82rem; color: #2563eb; font-weight: 500; }

  .up-divider { border: none; border-top: 1px solid #f1f5f9; margin: 1.25rem 0; }

  .up-actions { display: flex; gap: 0.85rem; }
  .up-submit-btn {
    flex: 1;
    padding: 0.85rem;
    background: #002045;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .up-submit-btn:hover { background: #3b82f6; transform: translateY(-1px); }
  .up-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .up-cancel-link {
    padding: 0.85rem 1.5rem;
    background: #f1f5f9;
    border-radius: 8px;
    color: #64748b;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .up-cancel-link:hover { background: #e2e8f0; color: #374151; }

  @media (max-width: 640px) {
    .up-row { grid-template-columns: 1fr; }
    .up-type-grid { grid-template-columns: 1fr 1fr; }
  }
`;

const TYPE_OPTIONS = [
  { value: 'cours', label: 'Cours', icon: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
  )},
  { value: 'TD', label: 'TD', icon: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
  )},
  { value: 'examen', label: 'Examen', icon: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
  )},
  { value: 'corrige', label: 'Corrigé', icon: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  )},
];

function UploadDocument() {
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    titre: '', description: '', type_document: 'cours',
    filiere_id: '', niveau: '', annee: new Date().getFullYear().toString(), fichier: null
  });

  useEffect(() => {
    filieresAPI.getAll().then(r => setFilieres(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'fichier') {
      setFormData({ ...formData, fichier: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fichier) { setError('Veuillez sélectionner un fichier'); return; }
    if (!formData.filiere_id) { setError('Veuillez sélectionner une filière'); return; }
    if (!formData.niveau) { setError('Veuillez sélectionner un niveau'); return; }
    setLoading(true);
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description || '');
    data.append('type_document', formData.type_document);
    data.append('filiere_id', formData.filiere_id);
    data.append('niveau', formData.niveau);
    data.append('annee', formData.annee);
    data.append('fichier', formData.fichier);
    try {
      await documentsAPI.create(data);
      setSuccess(true);
      setTimeout(() => navigate('/documents'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : null)
        || "Erreur lors de l'upload";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Layout title="Partager un document">
      <style>{styles}</style>

      <div className="up-wrap">
        <div className="up-header">
          <h1 className="up-title">Partager un document</h1>
          <p className="up-subtitle">Aidez vos camarades en partageant vos cours, TD ou examens</p>
        </div>

        {success && (
          <div className="up-alert success">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div><strong>Document publié avec succès !</strong> Redirection...</div>
          </div>
        )}
        {error && (
          <div className="up-alert error">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>{error}</div>
          </div>
        )}

        <div className="up-card">
          <div className="up-card-header">
            <div className="up-card-header-title">Informations du document</div>
            <div className="up-card-header-sub">Tous les champs marqués * sont obligatoires</div>
          </div>
          <div className="up-card-body">
            <form onSubmit={handleSubmit}>
              <div className="up-field">
                <label className="up-label">Titre <span className="up-required">*</span></label>
                <input name="titre" className="up-input" value={formData.titre} onChange={handleChange} placeholder="Ex: Cours d'Algèbre - Chapitre 3" required />
              </div>

              <div className="up-field">
                <label className="up-label">Description</label>
                <textarea name="description" className="up-textarea" value={formData.description} onChange={handleChange} placeholder="Décrivez brièvement le contenu..." />
              </div>

              <div className="up-field">
                <label className="up-label">Type de document <span className="up-required">*</span></label>
                <div className="up-type-grid">
                  {TYPE_OPTIONS.map(t => (
                    <div
                      key={t.value}
                      className={`up-type-card ${formData.type_document === t.value ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type_document: t.value})}
                    >
                      <div className="up-type-icon" style={{ color: formData.type_document === t.value ? '#3b82f6' : '#94a3b8' }}>{t.icon}</div>
                      <div className="up-type-label">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="up-row">
                <div className="up-field">
                  <label className="up-label">Filière <span className="up-required">*</span></label>
                  <select name="filiere_id" className="up-select" value={formData.filiere_id} onChange={handleChange} required>
                    <option value="">Sélectionnez une filière</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
                  </select>
                </div>
                <div className="up-field">
                  <label className="up-label">Niveau <span className="up-required">*</span></label>
                  <select name="niveau" className="up-select" value={formData.niveau} onChange={handleChange} required>
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

              <div className="up-field">
                <label className="up-label">Année académique <span className="up-required">*</span></label>
                <input name="annee" className="up-input" value={formData.annee} onChange={handleChange} placeholder="Ex: 2025-2026" required />
              </div>

              <div className="up-field">
                <label className="up-label">Fichier <span className="up-required">*</span></label>
                <div className={`up-dropzone ${formData.fichier ? 'has-file' : ''}`}>
                  <input
                    type="file" name="fichier"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  <div className="up-dropzone-icon">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </div>
                  {formData.fichier ? (
                    <>
                      <div className="up-dropzone-title">Fichier sélectionné</div>
                      <div className="up-file-name">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        {formData.fichier.name}
                        <span style={{ color: '#94a3b8' }}>({(formData.fichier.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="up-dropzone-sub" style={{ marginTop: '0.4rem' }}>Cliquez pour changer</div>
                    </>
                  ) : (
                    <>
                      <div className="up-dropzone-title">Glissez votre fichier ici ou cliquez pour parcourir</div>
                      <div className="up-dropzone-sub">PDF, DOC, DOCX, PPT, PPTX, JPG, PNG — Max 10 MB</div>
                    </>
                  )}
                </div>
              </div>

              <hr className="up-divider" />

              <div className="up-actions">
                <button type="submit" className="up-submit-btn" disabled={loading}>
                  {loading ? 'Publication en cours...' : 'Publier le document'}
                </button>
                <Link to="/documents" className="up-cancel-link">Annuler</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UploadDocument;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, documentsAPI, filieresAPI, etablissementsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .profile-hero {
    background: #002045;
    border-radius: 16px;
    padding: 2rem 2.25rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .profile-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(59,130,246,0.15);
    filter: blur(50px);
  }
  .profile-hero-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }

  .profile-avatar-wrap { position: relative; flex-shrink: 0; cursor: pointer; }
  .profile-avatar {
    width: 88px; height: 88px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1.75rem; font-weight: 800;
    border: 3px solid rgba(255,255,255,0.15);
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }
  .profile-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .profile-avatar-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s;
    color: #fff;
  }
  .profile-avatar-wrap:hover .profile-avatar-overlay { opacity: 1; }
  .profile-avatar-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; border-radius: 50%; }

  .profile-info { flex: 1; }
  .profile-name { font-family: 'Manrope', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 0.3rem; }
  .profile-role-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.35); color: #93c5fd; font-size: 0.75rem; font-weight: 600; padding: 0.22rem 0.7rem; border-radius: 20px; text-transform: capitalize; margin-bottom: 0.3rem; }
  .profile-email { color: rgba(255,255,255,0.45); font-size: 0.85rem; }

  .profile-stats { display: flex; gap: 1.5rem; margin-left: auto; }
  .profile-stat { text-align: center; }
  .profile-stat-num { font-family: 'Manrope', sans-serif; font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.04em; }
  .profile-stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }

  .profile-tabs { display: flex; gap: 0.35rem; margin-bottom: 1.5rem; background: #fff; border-radius: 10px; padding: 0.35rem; }
  .profile-tab { flex: 1; padding: 0.6rem; text-align: center; font-size: 0.82rem; font-weight: 600; border: none; border-radius: 7px; cursor: pointer; color: #64748b; background: none; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .profile-tab:hover { color: #374151; background: #f8fafc; }
  .profile-tab.active { background: #002045; color: #fff; }

  .profile-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.25rem; }

  .pcard { background: #fff; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.1rem; }
  .pcard-title {
    font-family: 'Manrope', sans-serif; font-size: 0.82rem; font-weight: 700;
    color: #0f172a; margin-bottom: 1.1rem; padding-bottom: 0.7rem;
    border-bottom: 1px solid #f1f5f9;
    text-transform: uppercase; letter-spacing: 0.07em;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pcard-edit-btn { font-size: 0.78rem; color: #3b82f6; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0.2rem 0.5rem; border-radius: 4px; transition: background 0.15s; font-weight: 500; }
  .pcard-edit-btn:hover { background: #eff6ff; }

  .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
  .alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
  .alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .form-group.full { grid-column: 1/-1; }
  .form-label { font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; font-weight: 600; }
  .form-input, .form-select {
    padding: 0.68rem 0.9rem;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.875rem;
    color: #0f172a; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .form-input:focus, .form-select:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .form-input:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
  .form-actions { display: flex; gap: 0.65rem; margin-top: 1rem; justify-content: flex-end; }
  .btn-save { background: #002045; color: #fff; border: none; padding: 0.65rem 1.35rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.15s; font-family: 'Inter', sans-serif; }
  .btn-save:hover { background: #3b82f6; }
  .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel { background: #f1f5f9; color: #64748b; border: none; padding: 0.65rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .btn-cancel:hover { background: #e2e8f0; }

  .info-row { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid #f8fafc; }
  .info-row:last-child { border-bottom: none; }
  .info-row-label { font-size: 0.8rem; color: #94a3b8; }
  .info-row-value { font-size: 0.875rem; color: #0f172a; font-weight: 500; }

  .doc-tag { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.18rem 0.5rem; border-radius: 4px; display: inline-block; margin-bottom: 0.18rem; }
  .doc-tag.cours { background: #eff6ff; color: #2563eb; }
  .doc-tag.TD { background: #fefce8; color: #ca8a04; }
  .doc-tag.examen { background: #fef3c7; color: #d97706; }
  .doc-tag.corrige { background: #f0fdf4; color: #059669; }

  .doc-item { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid #f8fafc; text-decoration: none; transition: background 0.15s; }
  .doc-item:last-child { border-bottom: none; }
  .doc-item-title { font-size: 0.875rem; font-weight: 500; color: #0f172a; }
  .doc-item:hover .doc-item-title { color: #3b82f6; }
  .doc-item-meta { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }
  .doc-downloads { font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 0.25rem; }

  .pwd-note { font-size: 0.82rem; color: #64748b; margin-bottom: 1rem; line-height: 1.6; }

  .danger-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 1.35rem; }
  .danger-title { font-size: 0.875rem; font-weight: 700; color: #991b1b; margin-bottom: 0.4rem; }
  .danger-text { font-size: 0.82rem; color: #b91c1c; margin-bottom: 1rem; line-height: 1.6; }
  .btn-danger { background: #dc2626; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .btn-danger:hover { background: #b91c1c; }

  @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr; } .profile-stats { display: none; } }
  @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
`;

const getInitials = (prenom, nom) => `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase() || '?';
const tagClass = (type) => ({ cours: 'cours', TD: 'TD', examen: 'examen', corrige: 'corrige' }[type] || 'cours');

function Profile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('infos');
  const [myDocs, setMyDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [filieres, setFilieres] = useState([]);
  const [etablissements, setEtablissements] = useState([]);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ prenom: '', nom: '', niveau: '', telephone: '', filiere_id: '', etablissement_id: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [pwdData, setPwdData] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        niveau: user.niveau || '',
        telephone: user.telephone || '',
        filiere_id: user.filiere_id ? String(user.filiere_id) : '',
        etablissement_id: user.etablissement_id ? String(user.etablissement_id) : '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingDocs(true);
    documentsAPI.getAll({ user_id: user.id, sort: 'recent' })
      .then(r => setMyDocs(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoadingDocs(false));
  }, [user]);

  useEffect(() => {
    if (editing) {
      Promise.all([filieresAPI.getAll(), etablissementsAPI.getAll()])
        .then(([fRes, eRes]) => { setFilieres(fRes.data || []); setEtablissements(eRes.data || []); })
        .catch(console.error);
    }
  }, [editing]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const r = await authAPI.updateProfile(formData);
      if (setUser) setUser(r.data.user || r.data);
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    const data = new FormData();
    data.append('photo', file);
    try {
      const r = await authAPI.updatePhoto(data);
      if (setUser) setUser(r.data.user || r.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du chargement de la photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePwdChange = async () => {
    if (pwdData.password !== pwdData.password_confirmation) {
      setPwdError('Les mots de passe ne correspondent pas');
      return;
    }
    setPwdSaving(true);
    setPwdError('');
    try {
      await authAPI.updatePassword(pwdData);
      setPwdSuccess(true);
      setPwdData({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPwdSaving(false);
    }
  };

  if (!user) return (
    <Layout title="Profil">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#94a3b8' }}>
        Chargement...
      </div>
    </Layout>
  );

  const totalDownloads = myDocs.reduce((sum, d) => sum + (d.nombre_telechargements || 0), 0);

  return (
    <Layout title="Mon profil">
      <style>{styles}</style>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-avatar-wrap" title="Changer la photo de profil">
            <div className="profile-avatar">
              {user.profil_photo
                ? <img src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api','')}/storage/${user.profil_photo}`} alt="profil" />
                : getInitials(user.prenom, user.nom)}
            </div>
            <div className="profile-avatar-overlay">
              {photoUploading ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="profile-avatar-input" onChange={handlePhotoChange} disabled={photoUploading} />
          </div>

          <div className="profile-info">
            <div className="profile-name">{user.prenom} {user.nom}</div>
            <div className="profile-role-badge">{user.role}</div>
            <div className="profile-email">{user.email}</div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-num">{myDocs.length}</div>
              <div className="profile-stat-label">Documents</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-num">{totalDownloads}</div>
              <div className="profile-stat-label">Téléchargements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {[
          { key: 'infos', label: 'Informations' },
          { key: 'documents', label: 'Mes documents' },
          { key: 'securite', label: 'Sécurité' },
        ].map(tab => (
          <button key={tab.key} className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-layout">
        <div>
          {/* INFOS */}
          {activeTab === 'infos' && (
            <>
              {saveSuccess && <div className="alert success">Profil mis à jour avec succès !</div>}
              {saveError && <div className="alert error">{saveError}</div>}
              <div className="pcard">
                <div className="pcard-title">
                  Informations personnelles
                  {!editing && <button className="pcard-edit-btn" onClick={() => setEditing(true)}>Modifier</button>}
                </div>
                {editing ? (
                  <>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Prénom</label>
                        <input className="form-input" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input className="form-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" value={user.email} disabled />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Téléphone</label>
                        <input className="form-input" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} placeholder="+221 77 000 00 00" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Niveau</label>
                        <select className="form-select" value={formData.niveau} onChange={e => setFormData({...formData, niveau: e.target.value})}>
                          <option value="">-- Sélectionner --</option>
                          <option value="Seconde">Seconde</option>
                          <option value="Premiere">Première</option>
                          <option value="Terminale">Terminale</option>
                          <option value="L1">L1</option><option value="L2">L2</option>
                          <option value="L3">L3</option><option value="M1">M1</option>
                          <option value="M2">M2</option><option value="Doctorat">Doctorat</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Filière</label>
                        <select className="form-select" value={formData.filiere_id} onChange={e => setFormData({...formData, filiere_id: e.target.value})}>
                          <option value="">-- Sélectionner --</option>
                          {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
                        </select>
                      </div>
                      <div className="form-group full">
                        <label className="form-label">Établissement</label>
                        <select className="form-select" value={formData.etablissement_id} onChange={e => setFormData({...formData, etablissement_id: e.target.value})}>
                          <option value="">-- Sélectionner --</option>
                          {etablissements.map(e => <option key={e.id} value={e.id}>{e.nom_etablissement}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-cancel" onClick={() => { setEditing(false); setFormData({ prenom: user.prenom || '', nom: user.nom || '', niveau: user.niveau || '', telephone: user.telephone || '', filiere_id: user.filiere_id ? String(user.filiere_id) : '', etablissement_id: user.etablissement_id ? String(user.etablissement_id) : '' }); }}>Annuler</button>
                      <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-row"><span className="info-row-label">Prénom</span><span className="info-row-value">{user.prenom || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Nom</span><span className="info-row-value">{user.nom || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Email</span><span className="info-row-value">{user.email}</span></div>
                    <div className="info-row"><span className="info-row-label">Téléphone</span><span className="info-row-value">{user.telephone || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Rôle</span><span className="info-row-value" style={{textTransform:'capitalize'}}>{user.role}</span></div>
                    <div className="info-row"><span className="info-row-label">Niveau</span><span className="info-row-value">{user.niveau || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Filière</span><span className="info-row-value">{user.filiere?.nom_filiere || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Établissement</span><span className="info-row-value">{user.etablissement?.nom_etablissement || '—'}</span></div>
                    <div className="info-row"><span className="info-row-label">Membre depuis</span><span className="info-row-value">{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '—'}</span></div>
                  </>
                )}
              </div>
            </>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="pcard">
              <div className="pcard-title">Mes documents partagés</div>
              {loadingDocs ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>Chargement...</div>
              ) : myDocs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth="1.2" style={{ marginBottom: '1rem' }}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Vous n'avez pas encore partagé de document</div>
                  <Link to="/upload" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>Partager votre premier document</Link>
                </div>
              ) : myDocs.map(doc => (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="doc-item">
                  <div>
                    <span className={`doc-tag ${tagClass(doc.type_document)}`}>{doc.type_document}</span>
                    <div className="doc-item-title">{doc.titre}</div>
                    <div className="doc-item-meta">{doc.niveau} · {doc.filiere?.nom_filiere || ''} · {doc.annee}</div>
                  </div>
                  <div className="doc-downloads">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    {doc.nombre_telechargements}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* SECURITE */}
          {activeTab === 'securite' && (
            <>
              {pwdSuccess && <div className="alert success">Mot de passe changé avec succès !</div>}
              {pwdError && <div className="alert error">{pwdError}</div>}
              <div className="pcard">
                <div className="pcard-title">Changer le mot de passe</div>
                <p className="pwd-note">Choisissez un mot de passe fort d'au moins 8 caractères.</p>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="form-label">Mot de passe actuel</label>
                    <input type="password" className="form-input" value={pwdData.current_password} onChange={e => setPwdData({...pwdData, current_password: e.target.value})} placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input type="password" className="form-input" value={pwdData.password} onChange={e => setPwdData({...pwdData, password: e.target.value})} placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmer</label>
                    <input type="password" className="form-input" value={pwdData.password_confirmation} onChange={e => setPwdData({...pwdData, password_confirmation: e.target.value})} placeholder="••••••••" />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handlePwdChange} disabled={pwdSaving || !pwdData.current_password || !pwdData.password}>
                    {pwdSaving ? 'Changement...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </div>
              <div className="danger-card">
                <div className="danger-title">Zone de danger</div>
                <p className="danger-text">La suppression de votre compte est irréversible. Tous vos documents et messages seront supprimés définitivement.</p>
                <button className="btn-danger" onClick={() => alert('Contactez un administrateur pour supprimer votre compte.')}>Supprimer mon compte</button>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div>
          <div className="pcard">
            <div className="pcard-title">Statistiques</div>
            <div className="info-row"><span className="info-row-label">Documents partagés</span><span className="info-row-value">{myDocs.length}</span></div>
            <div className="info-row"><span className="info-row-label">Total téléchargements</span><span className="info-row-value">{totalDownloads}</span></div>
            <div className="info-row">
              <span className="info-row-label">Note moyenne</span>
              <span className="info-row-value">
                {(() => {
                  const rated = myDocs.filter(d => d.notes_avg_note);
                  return rated.length > 0
                    ? (rated.reduce((s, d) => s + Number(d.notes_avg_note), 0) / rated.length).toFixed(1) + ' / 5'
                    : '—';
                })()}
              </span>
            </div>
          </div>

          <div className="pcard">
            <div className="pcard-title">Navigation rapide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { to: '/dashboard', label: 'Tableau de bord' },
                { to: '/documents', label: 'Tous les documents' },
                { to: '/upload', label: 'Partager un document' },
                { to: '/messages', label: 'Messages' },
              ].map(link => (
                <Link
                  key={link.to} to={link.to}
                  style={{ display: 'block', padding: '0.55rem 0.75rem', borderRadius: '7px', textDecoration: 'none', color: '#374151', fontSize: '0.85rem', fontWeight: 500, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

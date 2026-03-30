import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', password: '', password_confirmation: '', role: 'etudiant',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(formData);
    if (result.success) navigate('/dashboard');
    else { setError(result.message); setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #f0f4f8;
        }

        .reg-left {
          width: 380px;
          flex-shrink: 0;
          background: #002045;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .reg-left::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(59,130,246,0.15);
          filter: blur(60px);
        }
        .reg-left::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(16,185,129,0.08);
          filter: blur(70px);
        }

        .reg-left-logo {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 0.6rem;
          text-decoration: none;
        }
        .reg-left-logo-mark {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Manrope', sans-serif;
          font-weight: 800; font-size: 0.85rem; color: #fff;
        }
        .reg-left-logo-text {
          font-family: 'Manrope', sans-serif;
          font-weight: 700; font-size: 1.05rem;
          color: #fff; letter-spacing: -0.02em;
        }

        .reg-left-body { position: relative; z-index: 2; }
        .reg-left-title {
          font-family: 'Manrope', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .reg-left-title span { color: #60a5fa; }
        .reg-left-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin-bottom: 1.75rem;
        }
        .reg-steps { display: flex; flex-direction: column; gap: 0.85rem; }
        .reg-step { display: flex; align-items: center; gap: 0.75rem; }
        .reg-step-num {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(59,130,246,0.2);
          border: 1px solid rgba(59,130,246,0.4);
          color: #93c5fd;
          font-size: 0.72rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .reg-step-text { font-size: 0.85rem; color: rgba(255,255,255,0.65); }

        .reg-left-footer {
          position: relative; z-index: 2;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }

        /* RIGHT */
        .reg-right {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
        }
        .reg-form-wrap {
          width: 100%;
          max-width: 440px;
        }
        .reg-form-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0.3rem;
        }
        .reg-form-sub {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1.75rem;
        }
        .reg-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
        .reg-field { margin-bottom: 1rem; }
        .reg-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.4rem;
        }
        .reg-input {
          width: 100%;
          padding: 0.72rem 0.9rem;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input::placeholder { color: #94a3b8; }
        .reg-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .reg-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; margin-bottom: 1.1rem; }
        .reg-role-card {
          padding: 0.85rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          text-align: center;
          background: #fff;
          transition: all 0.15s;
        }
        .reg-role-card:hover { border-color: #cbd5e1; }
        .reg-role-card.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .reg-role-label {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
        }
        .reg-role-card.active .reg-role-label { color: #2563eb; }

        .reg-btn {
          width: 100%;
          padding: 0.82rem;
          background: #002045;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          margin-top: 0.25rem;
        }
        .reg-btn:hover { background: #001530; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .reg-footer {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .reg-footer a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .reg-footer a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .reg-left { display: none; }
          .reg-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-left">
          <Link to="/register" className="reg-left-logo">
            <div className="reg-left-logo-mark">CS</div>
            <span className="reg-left-logo-text">CoursSN</span>
          </Link>

          <div className="reg-left-body">
            <h1 className="reg-left-title">
              Rejoignez la<br/>communauté<br/><span>CoursSN</span>
            </h1>
            <p className="reg-left-desc">
              Partagez vos connaissances et apprenez ensemble avec des milliers d'étudiants sénégalais.
            </p>
            <div className="reg-steps">
              <div className="reg-step">
                <div className="reg-step-num">1</div>
                <div className="reg-step-text">Créez votre compte gratuit</div>
              </div>
              <div className="reg-step">
                <div className="reg-step-num">2</div>
                <div className="reg-step-text">Accédez à tous les documents</div>
              </div>
              <div className="reg-step">
                <div className="reg-step-num">3</div>
                <div className="reg-step-text">Partagez vos cours et TD</div>
              </div>
            </div>
          </div>

          <div className="reg-left-footer">© 2026 CoursSN — Plateforme éducative sénégalaise</div>
        </div>

        <div className="reg-right">
          <div className="reg-form-wrap">
            <h2 className="reg-form-title">Créer un compte</h2>
            <p className="reg-form-sub">Rejoignez des milliers d'étudiants</p>

            {error && <div className="reg-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Nom</label>
                  <input name="nom" className="reg-input" value={formData.nom} onChange={handleChange} placeholder="Ndiaye" required />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Prénom</label>
                  <input name="prenom" className="reg-input" value={formData.prenom} onChange={handleChange} placeholder="Fatou" required />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Adresse email</label>
                <input type="email" name="email" className="reg-input" value={formData.email} onChange={handleChange} placeholder="votre@email.com" required />
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Mot de passe</label>
                  <input type="password" name="password" className="reg-input" value={formData.password} onChange={handleChange} placeholder="Min. 8 caractères" required minLength="8" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Confirmer</label>
                  <input type="password" name="password_confirmation" className="reg-input" value={formData.password_confirmation} onChange={handleChange} placeholder="Répéter" required minLength="8" />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Je suis</label>
                <div className="reg-roles">
                  <div
                    className={`reg-role-card ${formData.role === 'etudiant' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, role: 'etudiant'})}
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={formData.role === 'etudiant' ? '#3b82f6' : '#94a3b8'} strokeWidth="1.8">
                      <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                    <span className="reg-role-label">Étudiant</span>
                  </div>
                  <div
                    className={`reg-role-card ${formData.role === 'professeur' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, role: 'professeur'})}
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={formData.role === 'professeur' ? '#3b82f6' : '#94a3b8'} strokeWidth="1.8">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span className="reg-role-label">Professeur</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>
            </form>

            <div className="reg-footer">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

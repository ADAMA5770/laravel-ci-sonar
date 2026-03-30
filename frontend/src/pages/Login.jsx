import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #f0f4f8;
        }

        /* LEFT PANEL */
        .auth-left {
          width: 420px;
          flex-shrink: 0;
          background: #002045;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 2.75rem;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: rgba(59,130,246,0.15);
          filter: blur(60px);
        }
        .auth-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(99,179,237,0.1);
          filter: blur(80px);
        }

        .auth-left-logo {
          position: relative; z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
        }
        .auth-left-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Manrope', sans-serif;
          font-weight: 800; font-size: 0.9rem; color: #fff;
        }
        .auth-left-logo-text {
          font-family: 'Manrope', sans-serif;
          font-weight: 700; font-size: 1.1rem;
          color: #fff; letter-spacing: -0.02em;
        }

        .auth-left-body {
          position: relative; z-index: 2;
        }
        .auth-left-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(59,130,246,0.2);
          border: 1px solid rgba(59,130,246,0.35);
          color: #93c5fd;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 0.85rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .auth-left-title {
          font-family: 'Manrope', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .auth-left-title span { color: #60a5fa; }
        .auth-left-desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 340px;
        }

        .auth-left-stats {
          position: relative; z-index: 2;
          display: flex;
          gap: 0;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .auth-left-stat {
          flex: 1;
          padding-right: 1.5rem;
        }
        .auth-left-stat + .auth-left-stat {
          padding-left: 1.5rem;
          padding-right: 0;
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .auth-stat-num {
          font-family: 'Manrope', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .auth-stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          margin-top: 0.15rem;
        }

        /* RIGHT PANEL */
        .auth-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: #f0f4f8;
        }
        .auth-form-wrap {
          width: 100%;
          max-width: 400px;
        }
        .auth-form-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
        }
        .auth-form-sub {
          font-size: 0.88rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .auth-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .auth-field { margin-bottom: 1.1rem; }
        .auth-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
          letter-spacing: 0.01em;
        }
        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        .auth-btn {
          width: 100%;
          padding: 0.85rem;
          background: #002045;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          margin-top: 0.5rem;
          letter-spacing: 0.01em;
        }
        .auth-btn:hover { background: #001530; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .auth-footer a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .auth-left { display: none; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-left">
          <Link to="/login" className="auth-left-logo">
            <div className="auth-left-logo-mark">CS</div>
            <span className="auth-left-logo-text">CoursSN</span>
          </Link>

          <div className="auth-left-body">
            <div className="auth-left-tag">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              Plateforme Éducative
            </div>
            <h1 className="auth-left-title">
              Le savoir<br/>partagé au<br/><span>Sénégal</span>
            </h1>
            <p className="auth-left-desc">
              Accédez à des milliers de cours, TD et examens partagés par la communauté estudiantine sénégalaise.
            </p>
          </div>

          <div className="auth-left-stats">
            <div className="auth-left-stat">
              <div className="auth-stat-num">500k+</div>
              <div className="auth-stat-label">Documents</div>
            </div>
            <div className="auth-left-stat">
              <div className="auth-stat-num">12k+</div>
              <div className="auth-stat-label">Étudiants</div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Bon retour</h2>
            <p className="auth-form-sub">Connectez-vous pour accéder à vos cours</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Adresse email</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Mot de passe</label>
                <input
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="auth-footer">
              Pas encore de compte ?{' '}
              <Link to="/register">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

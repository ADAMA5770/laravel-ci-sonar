import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';

const layoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f0f4f8; color: #0f172a; }

  :root {
    --navy: #002045;
    --navy-light: #1a365d;
    --navy-dark: #001530;
    --bg: #f0f4f8;
    --card: #ffffff;
    --text: #0f172a;
    --muted: #64748b;
    --border: #e2e8f0;
    --blue: #3b82f6;
    --gold: #f59e0b;
    --green: #10b981;
    --sidebar-w: 256px;
  }

  /* ── SIDEBAR ── */
  .layout-sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: var(--sidebar-w);
    background: var(--navy);
    display: flex;
    flex-direction: column;
    z-index: 50;
    overflow: hidden;
  }

  .sidebar-logo {
    padding: 1.75rem 1.5rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
  }
  .sidebar-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 800; font-size: 0.9rem; color: #fff;
    flex-shrink: 0;
  }
  .sidebar-logo-text {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 1.1rem; color: #fff;
    letter-spacing: -0.02em;
  }

  .sidebar-section-label {
    padding: 1rem 1.5rem 0.4rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.35);
  }

  .sidebar-nav { flex: 1; padding: 0.5rem 0.75rem; display: flex; flex-direction: column; gap: 0.15rem; overflow-y: auto; }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    text-decoration: none;
    color: rgba(255,255,255,0.6);
    font-size: 0.88rem;
    font-weight: 500;
    transition: all 0.15s;
    position: relative;
  }
  .sidebar-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.07);
  }
  .sidebar-link.active {
    color: #fff;
    background: rgba(59,130,246,0.25);
  }
  .sidebar-link.active::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    background: #3b82f6;
    border-radius: 0 2px 2px 0;
  }
  .sidebar-link svg { flex-shrink: 0; opacity: 0.8; }
  .sidebar-link.active svg { opacity: 1; }

  .sidebar-badge {
    margin-left: auto;
    background: #ef4444;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  }

  .sidebar-bottom {
    padding: 1rem 0.75rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .sidebar-share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    margin-bottom: 0.75rem;
  }
  .sidebar-share-btn:hover { background: #2563eb; }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .sidebar-user:hover { background: rgba(255,255,255,0.07); }

  .sidebar-user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.72rem; font-weight: 700;
    flex-shrink: 0;
  }
  .sidebar-user-name {
    flex: 1;
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sidebar-logout-icon { color: rgba(255,255,255,0.4); cursor: pointer; flex-shrink: 0; }
  .sidebar-logout-icon:hover { color: #ef4444; }

  /* ── MAIN AREA ── */
  .layout-main {
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .layout-topbar {
    position: sticky;
    top: 0; z-index: 40;
    background: rgba(240,244,248,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    height: 60px;
    gap: 1rem;
  }
  .topbar-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    flex: 1;
  }
  .topbar-actions { display: flex; align-items: center; gap: 0.75rem; }
  .topbar-icon-btn {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    text-decoration: none;
    color: var(--muted);
    transition: all 0.15s;
    position: relative;
  }
  .topbar-icon-btn:hover { border-color: #cbd5e1; color: var(--text); }

  .layout-content { flex: 1; padding: 2rem; }

  @media (max-width: 768px) {
    .layout-sidebar { transform: translateX(-100%); }
    .layout-main { margin-left: 0; }
    .layout-content { padding: 1.25rem; }
  }
`;

const NavLink = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
      {badge > 0 && <span className="sidebar-badge">{badge > 9 ? '9+' : badge}</span>}
    </Link>
  );
};

function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationsAPI.getUnreadCount()
      .then(r => setUnread(r.data.unread_count || 0))
      .catch(() => {});
  }, []);

  const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() : '?';

  return (
    <>
      <style>{layoutStyles}</style>
      <div className="layout-sidebar">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-mark">CS</div>
          <span className="sidebar-logo-text">CoursSN</span>
        </Link>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" label="Tableau de bord" icon={
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          } />
          <NavLink to="/documents" label="Documents" icon={
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          } />
          <NavLink to="/messages" label="Messages" icon={
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          } />
          <NavLink to="/notifications" label="Notifications" badge={unread} icon={
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          } />
          <NavLink to="/profile" label="Mon profil" icon={
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          } />
        </nav>

        <div className="sidebar-bottom">
          <Link to="/upload" className="sidebar-share-btn">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Partager un document
          </Link>
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            <span className="sidebar-user-name">{user?.prenom} {user?.nom}</span>
            <span className="sidebar-logout-icon" onClick={logout} title="Déconnexion">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="layout-main">
        <div className="layout-topbar">
          <span className="topbar-title">{title || 'CoursSN'}</span>
          <div className="topbar-actions">
            <Link to="/notifications" className="topbar-icon-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {unread > 0 && <span style={{position:'absolute',top:2,right:2,width:8,height:8,background:'#ef4444',borderRadius:'50%'}} />}
            </Link>
            <Link to="/profile" className="topbar-icon-btn" style={{width:'auto',padding:'0 0.6rem',gap:'0.4rem',color:'var(--text)'}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#60a5fa)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'0.6rem',fontWeight:700}}>
                {initials}
              </div>
              <span style={{fontSize:'0.82rem',fontWeight:500}}>{user?.prenom}</span>
            </Link>
          </div>
        </div>
        <div className="layout-content">
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;

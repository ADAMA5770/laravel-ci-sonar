import { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .notif-wrap { max-width: 740px; }

  .notif-header { margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
  .notif-title-wrap {}
  .notif-title { font-family: 'Manrope', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 0.2rem; }
  .notif-subtitle { font-size: 0.85rem; color: #64748b; }

  .notif-actions { display: flex; gap: 0.65rem; }
  .btn-mark-all {
    background: #002045; color: #fff;
    border: none; padding: 0.55rem 1rem;
    border-radius: 8px; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .btn-mark-all:hover { background: #3b82f6; }
  .btn-clear {
    background: #f1f5f9; color: #64748b;
    border: none; padding: 0.55rem 1rem;
    border-radius: 8px; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .btn-clear:hover { background: #e2e8f0; color: #374151; }

  .notif-filters { display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
  .notif-filter-btn {
    padding: 0.42rem 0.9rem;
    border-radius: 20px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    color: #64748b;
    transition: all 0.15s;
  }
  .notif-filter-btn:hover { border-color: #3b82f6; color: #3b82f6; }
  .notif-filter-btn.active { background: #002045; border-color: #002045; color: #fff; }

  .notif-list { background: #fff; border-radius: 12px; overflow: hidden; }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 1.1rem 1.35rem;
    border-bottom: 1px solid #f8fafc;
    transition: background 0.15s;
    cursor: pointer;
    position: relative;
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: #f8fafc; }
  .notif-item.unread { background: #f0f7ff; }
  .notif-item.unread:hover { background: #e8f0fe; }

  .notif-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .notif-icon-wrap.message { background: #eff6ff; }
  .notif-icon-wrap.document { background: #fffbeb; }
  .notif-icon-wrap.annonce { background: #f0fdf4; }
  .notif-icon-wrap.default { background: #f1f5f9; }

  .notif-body { flex: 1; min-width: 0; }
  .notif-contenu { font-size: 0.88rem; color: #0f172a; line-height: 1.5; }
  .notif-item.unread .notif-contenu { font-weight: 500; }
  .notif-meta { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.35rem; }

  .notif-badge { font-size: 0.67rem; font-weight: 700; text-transform: uppercase; padding: 0.15rem 0.5rem; border-radius: 4px; }
  .notif-badge.message { background: #eff6ff; color: #2563eb; }
  .notif-badge.document { background: #fffbeb; color: #d97706; }
  .notif-badge.annonce { background: #f0fdf4; color: #059669; }

  .notif-time { font-size: 0.72rem; color: #94a3b8; }
  .notif-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; margin-top: 0.4rem; }

  .notif-item-actions { display: flex; gap: 0.3rem; flex-shrink: 0; align-self: center; }
  .notif-action-btn {
    background: none; border: 1.5px solid transparent;
    width: 28px; height: 28px;
    border-radius: 6px;
    cursor: pointer;
    color: #94a3b8;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    font-size: 0.78rem;
  }
  .notif-action-btn:hover { background: #f1f5f9; border-color: #e2e8f0; color: #374151; }

  .notif-empty { padding: 4rem 2rem; text-align: center; }
  .notif-empty-icon { color: #cbd5e1; margin-bottom: 1rem; }
  .notif-empty-title { font-family: 'Manrope', sans-serif; font-size: 1rem; font-weight: 700; color: #64748b; margin-bottom: 0.35rem; }
  .notif-empty-text { font-size: 0.82rem; color: #94a3b8; }

  .notif-loading { padding: 3rem; text-align: center; color: #94a3b8; font-size: 0.85rem; }
`;

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jour${Math.floor(diff / 86400) > 1 ? 's' : ''}`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const typeClass = (type) => ({ message: 'message', document: 'document', annonce: 'annonce' }[type] || 'default');

const TypeIcon = ({ type }) => {
  const color = { message: '#3b82f6', document: '#f59e0b', annonce: '#10b981' }[type] || '#94a3b8';
  if (type === 'message') return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
  );
  if (type === 'document') return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
  );
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    notificationsAPI.getAll()
      .then(r => setNotifications(r.data.data || r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch {}
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
    } catch {}
  };

  const handleClearRead = async () => {
    try {
      await notificationsAPI.clearRead();
      setNotifications(prev => prev.filter(n => !n.lu));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.lu;
    if (filter === 'message' || filter === 'document' || filter === 'annonce') return n.type === filter;
    return true;
  });

  return (
    <Layout title="Notifications">
      <style>{styles}</style>

      <div className="notif-wrap">
        <div className="notif-header">
          <div className="notif-title-wrap">
            <h1 className="notif-title">Notifications</h1>
            <p className="notif-subtitle">
              {unreadCount > 0
                ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Toutes les notifications sont lues'}
            </p>
          </div>
          <div className="notif-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={handleMarkAllAsRead}>Tout marquer lu</button>
            )}
            <button className="btn-clear" onClick={handleClearRead}>Effacer les lues</button>
          </div>
        </div>

        <div className="notif-filters">
          {[
            { key: 'all', label: `Toutes (${notifications.length})` },
            { key: 'unread', label: `Non lues (${unreadCount})` },
            { key: 'message', label: 'Messages' },
            { key: 'document', label: 'Documents' },
            { key: 'annonce', label: 'Annonces' },
          ].map(f => (
            <button
              key={f.key}
              className={`notif-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {loading ? (
            <div className="notif-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <div className="notif-empty-title">Aucune notification</div>
              <div className="notif-empty-text">
                {filter !== 'all' ? 'Aucune notification dans cette catégorie.' : 'Vous êtes à jour !'}
              </div>
            </div>
          ) : filtered.map(n => (
            <div
              key={n.id}
              className={`notif-item ${!n.lu ? 'unread' : ''}`}
              onClick={e => !n.lu && handleMarkAsRead(n.id, e)}
            >
              <div className={`notif-icon-wrap ${typeClass(n.type)}`}>
                <TypeIcon type={n.type} />
              </div>
              <div className="notif-body">
                <div className="notif-contenu">{n.contenu}</div>
                <div className="notif-meta">
                  <span className={`notif-badge ${typeClass(n.type)}`}>{n.type || 'info'}</span>
                  <span className="notif-time">{formatTime(n.created_at)}</span>
                </div>
              </div>
              {!n.lu && <div className="notif-unread-dot" />}
              <div className="notif-item-actions">
                {!n.lu && (
                  <button className="notif-action-btn" title="Marquer comme lu" onClick={e => handleMarkAsRead(n.id, e)}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  </button>
                )}
                <button className="notif-action-btn" title="Supprimer" onClick={e => handleDelete(n.id, e)}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .msg-wrap { display: grid; grid-template-columns: 300px 1fr; gap: 1rem; height: calc(100vh - 130px); }

  /* CONVERSATIONS */
  .conv-panel { background: #fff; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
  .conv-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .conv-header-title { font-family: 'Manrope', sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f172a; }
  .conv-new-btn {
    width: 30px; height: 30px;
    background: #3b82f6;
    border: none;
    border-radius: 50%;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .conv-new-btn:hover { background: #2563eb; }

  .conv-search { padding: 0.6rem 1rem; border-bottom: 1px solid #f1f5f9; }
  .conv-search input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 7px;
    font-size: 0.82rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    color: #0f172a;
    transition: border-color 0.15s;
  }
  .conv-search input:focus { border-color: #3b82f6; background: #fff; }

  .conv-list { flex: 1; overflow-y: auto; }
  .conv-item { padding: 0.85rem 1.25rem; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; gap: 0.7rem; }
  .conv-item:hover { background: #f8fafc; }
  .conv-item.active { background: #eff6ff; }
  .conv-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #60a5fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.78rem; font-weight: 700; flex-shrink: 0; }
  .conv-avatar.alt { background: linear-gradient(135deg, #10b981, #34d399); }
  .conv-info { flex: 1; min-width: 0; }
  .conv-name { font-size: 0.85rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .conv-last { font-size: 0.75rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.1rem; }
  .conv-time { font-size: 0.68rem; color: #94a3b8; flex-shrink: 0; }
  .conv-empty { padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.85rem; line-height: 1.6; }

  /* CHAT */
  .chat-panel { background: #fff; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
  .chat-header { padding: 0.9rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.75rem; }
  .chat-header-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #60a5fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.78rem; font-weight: 700; }
  .chat-header-name { font-size: 0.92rem; font-weight: 600; color: #0f172a; }
  .chat-header-role { font-size: 0.75rem; color: #94a3b8; }

  .chat-messages { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; background: #f8fafc; }
  .msg-row { display: flex; align-items: flex-end; gap: 0.4rem; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #34d399); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.6rem; font-weight: 700; flex-shrink: 0; }
  .msg-bubble { max-width: 65%; padding: 0.65rem 0.9rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.5; }
  .msg-bubble.theirs { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-bottom-left-radius: 4px; }
  .msg-bubble.mine { background: #002045; color: #fff; border-bottom-right-radius: 4px; }
  .msg-time { font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem; }
  .msg-time.mine { text-align: right; }

  .chat-input-area { padding: 0.9rem 1.25rem; border-top: 1px solid #f1f5f9; display: flex; gap: 0.6rem; align-items: flex-end; }
  .chat-input {
    flex: 1;
    padding: 0.65rem 0.9rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    resize: none;
    max-height: 120px;
    transition: border-color 0.15s;
    color: #0f172a;
  }
  .chat-input:focus { border-color: #3b82f6; background: #fff; }
  .chat-send-btn {
    background: #002045;
    color: #fff;
    border: none;
    width: 40px; height: 40px;
    border-radius: 10px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .chat-send-btn:hover { background: #3b82f6; }
  .chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; gap: 0.6rem; padding: 2rem; text-align: center; }
  .chat-empty-icon { color: #cbd5e1; margin-bottom: 0.4rem; }
  .chat-empty-title { font-family: 'Manrope', sans-serif; font-size: 1rem; font-weight: 700; color: #64748b; }
  .chat-empty-text { font-size: 0.82rem; max-width: 260px; line-height: 1.5; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: #fff; border-radius: 14px; padding: 1.75rem; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .modal-title { font-family: 'Manrope', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem; }
  .modal-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; margin-bottom: 0.35rem; }
  .modal-input {
    width: 100%;
    padding: 0.65rem 0.9rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    color: #0f172a;
    transition: border-color 0.15s;
    margin-bottom: 0.85rem;
  }
  .modal-input:focus { border-color: #3b82f6; background: #fff; }
  .modal-actions { display: flex; gap: 0.65rem; margin-top: 0.5rem; }
  .modal-cancel { flex: 1; background: #f1f5f9; color: #64748b; border: none; padding: 0.65rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; }
  .modal-submit { flex: 1; background: #002045; color: #fff; border: none; padding: 0.65rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .modal-submit:hover { background: #3b82f6; }
  .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .modal-error { color: #dc2626; font-size: 0.8rem; margin-top: 0.4rem; }

  .loading-wrap { display: flex; align-items: center; justify-content: center; height: 150px; color: #94a3b8; font-size: 0.85rem; gap: 0.5rem; }

  @media (max-width: 768px) {
    .msg-wrap { grid-template-columns: 1fr; height: auto; }
    .conv-panel { max-height: 280px; }
  }
`;

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return d.toLocaleDateString('fr-FR', { weekday: 'short' });
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [showNewConv, setShowNewConv] = useState(false);
  const [newConvEmail, setNewConvEmail] = useState('');
  const [newConvMessage, setNewConvMessage] = useState('');
  const [newConvError, setNewConvError] = useState('');
  const [newConvLoading, setNewConvLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLoadingConvs(true);
    messagesAPI.getAll()
      .then(r => {
        const convs = r.data.data || r.data || [];
        setConversations(convs);
        const targetId = searchParams.get('conv');
        if (targetId) {
          const found = convs.find(c => String(c.id) === targetId);
          if (found) setActiveConv(found);
        } else if (convs.length > 0) {
          setActiveConv(convs[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    messagesAPI.getMessages(activeConv.id)
      .then(r => setMessages(r.data.data || r.data || []))
      .catch(console.error)
      .finally(() => setLoadingMsgs(false));
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConv || sending) return;
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);
    const tempMsg = { id: Date.now(), contenu: text, expediteur_id: user?.id, created_at: new Date().toISOString(), _temp: true };
    setMessages(prev => [...prev, tempMsg]);
    try {
      await messagesAPI.send({ conversation_id: activeConv.id, contenu: text });
      const r = await messagesAPI.getMessages(activeConv.id);
      setMessages(r.data.data || r.data || []);
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleNewConv = async () => {
    if (!newConvEmail.trim() || !newConvMessage.trim()) return;
    setNewConvError('');
    setNewConvLoading(true);
    try {
      const r = await messagesAPI.startConversation({ email: newConvEmail, contenu: newConvMessage });
      const conv = r.data.conversation || r.data;
      setConversations(prev => [conv, ...prev]);
      setActiveConv(conv);
      setShowNewConv(false);
      setNewConvEmail('');
      setNewConvMessage('');
    } catch (err) {
      setNewConvError(err.response?.data?.message || 'Utilisateur introuvable');
    } finally {
      setNewConvLoading(false);
    }
  };

  const getOtherUser = (conv) => {
    if (!conv || !user) return null;
    if (conv.user1 && conv.user1.id !== user.id) return conv.user1;
    if (conv.user2 && conv.user2.id !== user.id) return conv.user2;
    return conv.other_user || null;
  };

  const getOtherUserName = (conv) => {
    const u = getOtherUser(conv);
    if (!u) return 'Utilisateur';
    return `${u.prenom || ''} ${u.nom || ''}`.trim() || u.email || 'Utilisateur';
  };

  const filteredConvs = conversations.filter(c =>
    getOtherUserName(c).toLowerCase().includes(search.toLowerCase())
  );

  const otherUserName = activeConv ? getOtherUserName(activeConv) : '';
  const otherUser = activeConv ? getOtherUser(activeConv) : null;

  return (
    <Layout title="Messages">
      <style>{styles}</style>

      <div className="msg-wrap">
        {/* Conversations */}
        <div className="conv-panel">
          <div className="conv-header">
            <span className="conv-header-title">Conversations</span>
            <button className="conv-new-btn" onClick={() => setShowNewConv(true)}>+</button>
          </div>
          <div className="conv-search">
            <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="conv-list">
            {loadingConvs ? (
              <div className="loading-wrap">Chargement...</div>
            ) : filteredConvs.length === 0 ? (
              <div className="conv-empty">
                {conversations.length === 0 ? 'Aucune conversation.\nCliquez + pour commencer.' : 'Aucun résultat'}
              </div>
            ) : (
              filteredConvs.map((conv, i) => {
                const name = getOtherUserName(conv);
                const lastMsg = conv.last_message || conv.dernier_message;
                return (
                  <div
                    key={conv.id}
                    className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                    onClick={() => setActiveConv(conv)}
                  >
                    <div className={`conv-avatar ${i % 2 === 0 ? '' : 'alt'}`}>{getInitials(name)}</div>
                    <div className="conv-info">
                      <div className="conv-name">{name}</div>
                      <div className="conv-last">{lastMsg?.contenu || 'Début de la conversation'}</div>
                    </div>
                    <span className="conv-time">{formatTime(lastMsg?.created_at || conv.created_at)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="chat-panel">
          {!activeConv ? (
            <>
              <div className="chat-header" />
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <div className="chat-empty-title">Vos messages</div>
                <div className="chat-empty-text">Sélectionnez une conversation ou commencez-en une avec le bouton +</div>
              </div>
            </>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header-avatar">{getInitials(otherUserName)}</div>
                <div>
                  <div className="chat-header-name">{otherUserName}</div>
                  <div className="chat-header-role">{otherUser?.role || 'Étudiant'}</div>
                </div>
              </div>

              <div className="chat-messages">
                {loadingMsgs ? (
                  <div className="loading-wrap">Chargement...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: '2rem' }}>
                    Commencez la conversation !
                  </div>
                ) : messages.map((msg) => {
                  const isMine = msg.expediteur_id === user?.id;
                  return (
                    <div key={msg.id} className={`msg-row ${isMine ? 'mine' : ''}`}>
                      {!isMine && <div className="msg-avatar">{getInitials(otherUserName)}</div>}
                      <div>
                        <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>{msg.contenu}</div>
                        <div className={`msg-time ${isMine ? 'mine' : ''}`}>{formatTime(msg.created_at)}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <textarea
                  className="chat-input"
                  placeholder="Écrivez votre message... (Entrée pour envoyer)"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button className="chat-send-btn" onClick={handleSend} disabled={!newMessage.trim() || sending}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showNewConv && (
        <div className="modal-overlay" onClick={() => setShowNewConv(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nouvelle conversation</div>
            <div className="modal-label">Email de l'utilisateur</div>
            <input className="modal-input" placeholder="exemple@email.com" value={newConvEmail} onChange={e => setNewConvEmail(e.target.value)} />
            <div className="modal-label">Premier message</div>
            <textarea className="modal-input" placeholder="Bonjour..." value={newConvMessage} onChange={e => setNewConvMessage(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
            {newConvError && <div className="modal-error">{newConvError}</div>}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowNewConv(false)}>Annuler</button>
              <button className="modal-submit" onClick={handleNewConv} disabled={!newConvEmail.trim() || !newConvMessage.trim() || newConvLoading}>
                {newConvLoading ? 'Envoi...' : 'Démarrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Messages;

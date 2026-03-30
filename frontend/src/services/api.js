import axios from 'axios';

// URL de base de l'API Laravel (variable d'environnement Vite en production)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonctions d'authentification
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  updateProfile: (data) => api.put('/profile', data),
  updatePassword: (data) => api.put('/password', data),
  updatePhoto: (formData) => api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Fonctions pour les documents
export const documentsAPI = {
  getAll: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/documents', { params: cleanParams });
  },
  create: (data) => api.post('/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  get: (id) => api.get(`/documents/${id}`),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  download: (id) => api.post(`/documents/${id}/download`),
  rate: (id, note) => api.post(`/documents/${id}/rate`, { note }),
};

// Fonctions pour les établissements
export const etablissementsAPI = {
  getAll: () => api.get('/etablissements'),
};

// Fonctions pour les filières
export const filieresAPI = {
  getAll: () => api.get('/filieres'),
};

// Fonctions pour la messagerie
export const messagesAPI = {
  getAll: () => api.get('/conversations'),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  send: (data) => api.post('/messages', data),
  startConversation: (data) => api.post('/conversations', data),
};

// Fonctions pour les notifications
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAsUnread: (id) => api.put(`/notifications/${id}/unread`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearRead: () => api.delete('/notifications/clear-read'),
};

export default api;
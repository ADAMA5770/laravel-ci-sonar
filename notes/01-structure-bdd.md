# Structure de la Base de Données

## Tables principales

### 1. utilisateurs
- Contient les étudiants ET les professeurs
- Champ `role` pour différencier

### 2. etablissements
- CEM, Lycées, Universités
- Stocke le nom et la ville

### 3. filieres
- Informatique, Médecine, Droit, etc.

### 4. documents
- Cours, TD, examens, corrigés
- Lié à un utilisateur et une filière

### 5. notes_documents
- Système d'étoiles (1-5)
- Relation plusieurs-à-plusieurs

### 6. messages
- Chat entre utilisateurs

### 7. conversations
- Groupe les messages entre 2 personnes

### 8. tutoriels_videos
- Liens YouTube intégrés

### 9. annonces_cours
- Professeurs peuvent publier des annonces

### 10. notifications
- Alerte les utilisateurs des nouveautés






composer create-project laravel/laravel backend
```

**⏱️ Cette commande va prendre 2-3 minutes.** Composer va télécharger tous les fichiers nécessaires.

Tu vas voir plein de lignes défiler. C'est normal ! 😊

---

## 🤔 Pendant que ça s'installe, petite explication

### Pourquoi on appelle le dossier "backend" ?
```
plateforme-cours-senegal/
├── backend/          ← Laravel (API, base de données)
└── frontend/         ← React (interface utilisateur)
```

Comme ça, tout est bien séparé et organisé !

### Qu'est-ce que Laravel va créer ?

Laravel va générer plein de dossiers. Les plus importants pour toi sont :
```
backend/
├── app/              ← Ta logique métier (contrôleurs, modèles)
├── database/         ← Migrations (structure de la BDD)
├── routes/           ← Tes routes API
├── .env              ← Configuration (connexion BDD, etc.)
└── public/           ← Point d'entrée de l'API
```

---

## 📝 Une fois l'installation terminée

Quand Composer aura fini, tu verras un message comme :
```
Application ready! Build something amazing.
-- ============================================================
-- Plateforme Cours Sénégal - Dump SQL complet
-- Base de données : plateforme_cours_senegal
-- Généré le : 2026-03-29
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- Créer et sélectionner la base
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `plateforme_cours_senegal`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `plateforme_cours_senegal`;

-- ------------------------------------------------------------
-- Table : etablissements
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `etablissements` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_etablissement` VARCHAR(255)     NOT NULL,
  `type`              ENUM('CEM','Lycee','Universite') NOT NULL,
  `ville`             VARCHAR(255)     NOT NULL,
  `description`       TEXT,
  `created_at`        TIMESTAMP        NULL DEFAULT NULL,
  `updated_at`        TIMESTAMP        NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : filieres
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `filieres` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_filiere` VARCHAR(255)    NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `nom`                 VARCHAR(255)     NOT NULL,
  `prenom`              VARCHAR(255)     NOT NULL,
  `email`               VARCHAR(255)     NOT NULL,
  `telephone`           VARCHAR(20)      DEFAULT NULL,
  `email_verified_at`   TIMESTAMP        NULL DEFAULT NULL,
  `password`            VARCHAR(255)     NOT NULL,
  `profil_photo`        VARCHAR(255)     DEFAULT NULL,
  `role`                ENUM('etudiant','professeur') NOT NULL DEFAULT 'etudiant',
  `etablissement_id`    BIGINT UNSIGNED  DEFAULT NULL,
  `filiere_id`          BIGINT UNSIGNED  DEFAULT NULL,
  `niveau`              VARCHAR(255)     DEFAULT NULL,
  `remember_token`      VARCHAR(100)     DEFAULT NULL,
  `created_at`          TIMESTAMP        NULL DEFAULT NULL,
  `updated_at`          TIMESTAMP        NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  FOREIGN KEY (`etablissement_id`) REFERENCES `etablissements`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`filiere_id`)       REFERENCES `filieres`(`id`)       ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : documents
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `documents` (
  `id`                      BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`                 BIGINT UNSIGNED  NOT NULL,
  `titre`                   VARCHAR(255)     NOT NULL,
  `description`             TEXT             DEFAULT NULL,
  `type_document`           ENUM('cours','TD','examen','corrige') NOT NULL,
  `filiere_id`              BIGINT UNSIGNED  NOT NULL,
  `niveau`                  VARCHAR(255)     NOT NULL,
  `annee`                   VARCHAR(50)      NOT NULL,
  `fichier_url`             VARCHAR(500)     NOT NULL,
  `nombre_telechargements`  INT UNSIGNED     NOT NULL DEFAULT 0,
  `created_at`              TIMESTAMP        NULL DEFAULT NULL,
  `updated_at`              TIMESTAMP        NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`filiere_id`) REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : notes_documents
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notes_documents` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `document_id` BIGINT UNSIGNED NOT NULL,
  `note`        TINYINT         NOT NULL,
  `created_at`  TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notes_documents_user_document_unique` (`user_id`,`document_id`),
  FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`)     ON DELETE CASCADE,
  FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : conversations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversations` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user1_id`   BIGINT UNSIGNED NOT NULL,
  `user2_id`   BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT UNSIGNED NOT NULL,
  `expediteur_id`   BIGINT UNSIGNED NOT NULL,
  `contenu`         TEXT            NOT NULL,
  `created_at`      TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`      TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expediteur_id`)   REFERENCES `users`(`id`)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : tutoriels_videos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tutoriels_videos` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre`       VARCHAR(255)    NOT NULL,
  `description` TEXT            DEFAULT NULL,
  `url_video`   VARCHAR(500)    NOT NULL,
  `filiere_id`  BIGINT UNSIGNED NOT NULL,
  `created_at`  TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`filiere_id`) REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : annonces_cours
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `annonces_cours` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `professeur_id` BIGINT UNSIGNED NOT NULL,
  `titre`         VARCHAR(255)    NOT NULL,
  `contenu`       TEXT            NOT NULL,
  `filiere_id`    BIGINT UNSIGNED NOT NULL,
  `niveau`        VARCHAR(255)    DEFAULT NULL,
  `created_at`    TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`professeur_id`) REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`filiere_id`)    REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : notifications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `contenu`    TEXT            NOT NULL,
  `type`       ENUM('message','document','annonce') NOT NULL,
  `lu`         TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : personal_access_tokens (Laravel Sanctum)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255)    NOT NULL,
  `tokenable_id`   BIGINT UNSIGNED NOT NULL,
  `name`           VARCHAR(255)    NOT NULL,
  `token`          VARCHAR(64)     NOT NULL,
  `abilities`      TEXT            DEFAULT NULL,
  `last_used_at`   TIMESTAMP       NULL DEFAULT NULL,
  `expires_at`     TIMESTAMP       NULL DEFAULT NULL,
  `created_at`     TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`     TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : cache
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cache` (
  `key`        VARCHAR(255) NOT NULL,
  `value`      MEDIUMTEXT   NOT NULL,
  `expiration` INT          NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : jobs (Laravel Queue)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id`           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `queue`        VARCHAR(255)     NOT NULL,
  `payload`      LONGTEXT         NOT NULL,
  `attempts`     TINYINT UNSIGNED NOT NULL,
  `reserved_at`  INT UNSIGNED     DEFAULT NULL,
  `available_at` INT UNSIGNED     NOT NULL,
  `created_at`   INT UNSIGNED     NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : sessions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`            VARCHAR(255)    NOT NULL,
  `user_id`       BIGINT UNSIGNED DEFAULT NULL,
  `ip_address`    VARCHAR(45)     DEFAULT NULL,
  `user_agent`    TEXT            DEFAULT NULL,
  `payload`       LONGTEXT        NOT NULL,
  `last_activity` INT             NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table : password_reset_tokens
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email`      VARCHAR(255) NOT NULL,
  `token`      VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP    NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNÉES DE BASE : Établissements
-- ============================================================
INSERT INTO `etablissements` (`nom_etablissement`, `type`, `ville`, `description`, `created_at`, `updated_at`) VALUES
('Université Cheikh Anta Diop',   'Universite', 'Dakar',       'Principale université du Sénégal, fondée en 1957',      NOW(), NOW()),
('Université Gaston Berger',       'Universite', 'Saint-Louis', 'Université publique de la région nord',                 NOW(), NOW()),
('Université Alioune Diop',        'Universite', 'Bambey',      'Université publique de Bambey',                        NOW(), NOW()),
('École Supérieure Polytechnique', 'Universite', 'Dakar',       'Grande école d''ingénieurs de l''UCAD',                NOW(), NOW()),
('Lycée Lamine Guèye',             'Lycee',      'Dakar',       'Lycée historique du centre de Dakar',                  NOW(), NOW()),
('Lycée Seydina Limamou Laye',     'Lycee',      'Guédiawaye',  'Lycée moderne de la banlieue dakaroise',               NOW(), NOW()),
('Lycée Blaise Diagne',            'Lycee',      'Dakar',       'Lycée public de référence à Dakar',                    NOW(), NOW()),
('CEM Parcelles Assainies',        'CEM',        'Dakar',       'Collège d''enseignement moyen des Parcelles Assainies', NOW(), NOW()),
('CEM Pikine Guinaw Rail',         'CEM',        'Pikine',      'Collège d''enseignement moyen de Pikine',              NOW(), NOW());

-- ============================================================
-- DONNÉES DE BASE : Filières
-- ============================================================
INSERT INTO `filieres` (`nom_filiere`, `description`, `created_at`, `updated_at`) VALUES
('Informatique',      'Sciences informatiques, développement logiciel et réseaux',        NOW(), NOW()),
('Mathématiques',     'Mathématiques pures et appliquées, statistiques',                  NOW(), NOW()),
('Physique',          'Sciences physiques, mécanique, électricité et optique',            NOW(), NOW()),
('Chimie',            'Sciences chimiques, chimie organique et biochimie',                NOW(), NOW()),
('Biologie',          'Sciences de la vie et de la terre, biologie cellulaire',           NOW(), NOW()),
('Économie-Gestion',  'Sciences économiques, gestion d''entreprise et comptabilité',      NOW(), NOW()),
('Lettres Modernes',  'Littérature française et mondiale, philosophie, linguistique',     NOW(), NOW()),
('Génie Civil',       'Ingénierie civile, construction et BTP',                           NOW(), NOW()),
('Électronique',      'Génie électronique, télécommunications et systèmes embarqués',     NOW(), NOW()),
('Droit',             'Sciences juridiques, droit civil, droit des affaires et pénal',    NOW(), NOW()),
('Médecine',          'Études médicales, anatomie, pharmacologie et chirurgie',           NOW(), NOW()),
('Sciences Sociales', 'Sociologie, anthropologie, géographie humaine et démographie',     NOW(), NOW());

-- ============================================================
-- INSTRUCTIONS DE DÉPLOIEMENT
-- ============================================================
-- Option A — Utiliser ce fichier SQL directement :
--   mysql -u root -p plateforme_cours_senegal < plateforme_cours_senegal.sql
--
-- Option B — Utiliser les migrations Laravel (recommandé) :
--   cd backend
--   php artisan migrate:fresh
--   php artisan db:seed
--   php artisan storage:link
--
-- Comptes de test créés par le seeder (mot de passe : password123) :
--   Étudiants :
--     amadou.diallo@example.com
--     fatou.ndiaye@example.com
--     moussa.sall@example.com
--     aissatou.fall@example.com
--     ibrahima.gueye@example.com
--   Professeurs :
--     ousmane.thiam@example.com
--     mariama.ba@example.com
--     mamadou.cisse@example.com
-- ============================================================

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "🌱 Création des données de test...\n\n";

        // 1. Créer des établissements
        echo "📚 Création des établissements...\n";
        $etablissements = [
            [
                'nom_etablissement' => 'Université Cheikh Anta Diop',
                'type' => 'Universite',
                'ville' => 'Dakar',
                'description' => 'Principale université du Sénégal, fondée en 1957'
            ],
            [
                'nom_etablissement' => 'Université Gaston Berger',
                'type' => 'Universite',
                'ville' => 'Saint-Louis',
                'description' => 'Université publique située à Saint-Louis'
            ],
            [
                'nom_etablissement' => 'Lycée Lamine Guèye',
                'type' => 'Lycee',
                'ville' => 'Dakar',
                'description' => 'Lycée historique de Dakar'
            ],
            [
                'nom_etablissement' => 'Lycée Seydina Limamou Laye',
                'type' => 'Lycee',
                'ville' => 'Guédiawaye',
                'description' => 'Lycée moderne de la banlieue dakaroise'
            ],
            [
                'nom_etablissement' => 'CEM Parcelles Assainies',
                'type' => 'CEM',
                'ville' => 'Dakar',
                'description' => 'Collège d\'enseignement moyen'
            ]
        ];

        foreach ($etablissements as $etab) {
            Etablissement::create($etab);
            echo "  ✓ {$etab['nom_etablissement']}\n";
        }

        // 2. Créer des filières
        echo "\n📖 Création des filières...\n";
        $filieres = [
            [
                'nom_filiere' => 'Informatique',
                'description' => 'Sciences informatiques et développement logiciel'
            ],
            [
                'nom_filiere' => 'Mathématiques',
                'description' => 'Mathématiques pures et appliquées'
            ],
            [
                'nom_filiere' => 'Physique',
                'description' => 'Sciences physiques et applications'
            ],
            [
                'nom_filiere' => 'Chimie',
                'description' => 'Sciences chimiques et biochimie'
            ],
            [
                'nom_filiere' => 'Biologie',
                'description' => 'Sciences de la vie et de la terre'
            ],
            [
                'nom_filiere' => 'Économie',
                'description' => 'Sciences économiques et gestion'
            ],
            [
                'nom_filiere' => 'Lettres Modernes',
                'description' => 'Littérature et langues modernes'
            ],
            [
                'nom_filiere' => 'Génie Civil',
                'description' => 'Ingénierie civile et construction'
            ],
            [
                'nom_filiere' => 'Électronique',
                'description' => 'Génie électronique et télécommunications'
            ],
            [
                'nom_filiere' => 'Droit',
                'description' => 'Sciences juridiques et politiques'
            ]
        ];

        foreach ($filieres as $filiere) {
            Filiere::create($filiere);
            echo "  ✓ {$filiere['nom_filiere']}\n";
        }

        // 3. Créer des utilisateurs de test
        echo "\n👥 Création des utilisateurs de test...\n";
        
        // Étudiants
        $etudiants = [
            [
                'nom' => 'Diallo',
                'prenom' => 'Amadou',
                'email' => 'amadou.diallo@example.com',
                'password' => Hash::make('password123'),
                'role' => 'etudiant',
                'etablissement_id' => 1,
                'filiere_id' => 1,
                'niveau' => 'L1',
                'telephone' => '+221 77 123 45 67'
            ],
            [
                'nom' => 'Ndiaye',
                'prenom' => 'Fatou',
                'email' => 'fatou.ndiaye@example.com',
                'password' => Hash::make('password123'),
                'role' => 'etudiant',
                'etablissement_id' => 1,
                'filiere_id' => 1,
                'niveau' => 'L2',
                'telephone' => '+221 77 234 56 78'
            ],
            [
                'nom' => 'Sall',
                'prenom' => 'Moussa',
                'email' => 'moussa.sall@example.com',
                'password' => Hash::make('password123'),
                'role' => 'etudiant',
                'etablissement_id' => 1,
                'filiere_id' => 2,
                'niveau' => 'L3',
                'telephone' => '+221 77 345 67 89'
            ],
            [
                'nom' => 'Fall',
                'prenom' => 'Aïssatou',
                'email' => 'aissatou.fall@example.com',
                'password' => Hash::make('password123'),
                'role' => 'etudiant',
                'etablissement_id' => 2,
                'filiere_id' => 3,
                'niveau' => 'M1',
                'telephone' => '+221 77 456 78 90'
            ],
            [
                'nom' => 'Gueye',
                'prenom' => 'Ibrahima',
                'email' => 'ibrahima.gueye@example.com',
                'password' => Hash::make('password123'),
                'role' => 'etudiant',
                'etablissement_id' => 3,
                'filiere_id' => 4,
                'niveau' => 'Terminale',
                'telephone' => '+221 77 567 89 01'
            ]
        ];

        foreach ($etudiants as $etudiant) {
            User::create($etudiant);
            echo "  ✓ Étudiant: {$etudiant['prenom']} {$etudiant['nom']} ({$etudiant['email']})\n";
        }

        // Professeurs
        $professeurs = [
            [
                'nom' => 'Thiam',
                'prenom' => 'Ousmane',
                'email' => 'ousmane.thiam@example.com',
                'password' => Hash::make('password123'),
                'role' => 'professeur',
                'etablissement_id' => 1,
                'filiere_id' => 1,
                'niveau' => null,
                'telephone' => '+221 77 678 90 12'
            ],
            [
                'nom' => 'Ba',
                'prenom' => 'Mariama',
                'email' => 'mariama.ba@example.com',
                'password' => Hash::make('password123'),
                'role' => 'professeur',
                'etablissement_id' => 1,
                'filiere_id' => 2,
                'niveau' => null,
                'telephone' => '+221 77 789 01 23'
            ],
            [
                'nom' => 'Cissé',
                'prenom' => 'Mamadou',
                'email' => 'mamadou.cisse@example.com',
                'password' => Hash::make('password123'),
                'role' => 'professeur',
                'etablissement_id' => 2,
                'filiere_id' => 3,
                'niveau' => null,
                'telephone' => '+221 77 890 12 34'
            ]
        ];

        foreach ($professeurs as $prof) {
            User::create($prof);
            echo "  ✓ Professeur: {$prof['prenom']} {$prof['nom']} ({$prof['email']})\n";
        }

        echo "\n✅ Données de test créées avec succès!\n\n";
        echo "📝 Comptes de test:\n";
        echo "   Étudiants:\n";
        foreach ($etudiants as $e) {
            echo "     • {$e['email']} / password123\n";
        }
        echo "\n   Professeurs:\n";
        foreach ($professeurs as $p) {
            echo "     • {$p['email']} / password123\n";
        }
        echo "\n";
    }
}

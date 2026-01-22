<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /* user::all pour récupérer tous les utilisateurs
    user::find(1) pour trouver un utilisateur par son ID
    user::where('email', '

    /*
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    /*
        protected $fillable est un tableau qui définit quels attributs du modèle User peuvent être assignés en masse.
        * fillable permet de définir les champs qui peuvent être remplis en masse
        en masse signifie que plusieurs attributs peuvent être assignés en une seule opération,
        ce qui est utile lors de la création ou de la mise à jour d'un utilisateur.
    */
    protected $fillable = [
    'nom',           // ← CORRIGÉ : 'nom' au lieu de 'name'
    'prenom',        // ← AJOUTÉ
    'email',
    'password',
    'role',          // ← AJOUTÉ
    'profil_photo',  // ← AJOUTÉ si présent dans migration
    'etablissement_id',
    'filiere_id',
    'niveau',
    'telephone',     // ← AJOUTÉ si présent dans migration
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */

        /*
        protected $hidden est un tableau qui définit quels attributs du modèle User doivent être cachés lors de la sérialisation.
        * hidden permet de cacher certains champs lorsqu'on convertit le modèle en tableau ou en JSON
        cela est souvent utilisé pour protéger des informations sensibles, comme les mots de passe ou les tokens
        */
    protected $hidden = [
        'password',
        'remember_token',
         'tokens', // ← AJOUTE CETTE LIGNE pour cacher les tokens dans les relations
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     * casts permet de définir comment certains attributs doivent être convertis lorsqu'on les accède ou les modifie
     */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

        // Relations
    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class, 'etablissement_id');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function notesDocuments()
    {
        return $this->hasMany(NoteDocument::class);
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'expediteur_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function annoncesCours()
    {
        return $this->hasMany(AnnonceCours::class, 'professeur_id');
    }

    // Méthode helper pour vérifier si c'est un professeur
    public function estProfesseur()
    {
        return $this->role === 'professeur';
    }

    // Méthode helper pour vérifier si c'est un étudiant
    public function estEtudiant()
    {
        return $this->role === 'etudiant';
    }
}

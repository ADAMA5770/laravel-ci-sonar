<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    // Nom de la table (optionnel si elle suit la convention)
    //optionnel car par convention Laravel déduit le nom de la table à partir du nom du modèle en le mettant au pluriel et en utilisant des underscores pour séparer les mots.
    protected $table = 'etablissements';
    
    // Colonnes qu'on peut remplir en masse
    //securité pour éviter l'assignation de masse non intentionnelle
    protected $fillable = [
        'nom_etablissement',
        'type',
        'ville',
        'description'
    ];
    //ca dit à Laravel de gérer automatiquement les colonnes created_at et updated_at
    // Relations : Un établissement a plusieurs utilisateurs
    public function users()
    {
        return $this->hasMany(User::class, 'etablissement_id');
    }
}
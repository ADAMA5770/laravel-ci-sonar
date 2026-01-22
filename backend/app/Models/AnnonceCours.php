<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnonceCours extends Model
{
    protected $table = 'annonces_cours';
    
    protected $fillable = [
        'professeur_id',
        'titre',
        'contenu',
        'filiere_id',
        'niveau'
    ];
    
    // Relations
    //belongsto car une annonce de cours appartient à un seul professeur
    //relation inverse
    public function professeur()
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }
    //belongsto car une annonce de cours appartient à une seule filière
    //relation inverse
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
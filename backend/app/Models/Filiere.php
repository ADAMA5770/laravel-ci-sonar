<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $fillable = [
        'nom_filiere',
        'description'
    ];
    
    // Relations
    public function users()
    {
        return $this->hasMany(User::class, 'filiere_id');
    }
    
    public function documents()
    {
        return $this->hasMany(Document::class, 'filiere_id');
    }
    
    public function tutorielsVideos()
    {
        return $this->hasMany(TutorielVideo::class, 'filiere_id');
    }
    
    public function annoncesCours()
    {
        return $this->hasMany(AnnonceCours::class, 'filiere_id');
    }
}
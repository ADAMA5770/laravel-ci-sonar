<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TutorielVideo extends Model
{
    protected $table = 'tutoriels_videos';
    
    protected $fillable = [
        'titre',
        'description',
        'url_video',
        'filiere_id'
    ];
    
    // Relations
    //belongsto car un tutoriel vidéo appartient à une seule filière
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'type_document',
        'filiere_id',
        'niveau',
        'annee',
        'fichier_url',
        'nombre_telechargements'
    ];
    
    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //belongsto car un document appartient à une seule filière
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
    
    public function notes()
    {
        return $this->hasMany(NoteDocument::class, 'document_id');
    }
    
    // Méthode helper pour calculer la moyenne des notes
    public function moyenneNotes()
    {
        return $this->notes()->avg('note');
    }
}
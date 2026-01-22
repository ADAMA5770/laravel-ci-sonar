<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'expediteur_id',
        'contenu',
        'vu'
    ];
    
    protected $casts = [
        'vu' => 'boolean'
    ];
    
    // Relations
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
    
    public function expediteur()
    {
        return $this->belongsTo(User::class, 'expediteur_id');
    }
}
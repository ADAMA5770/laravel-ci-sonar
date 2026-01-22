<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'utilisateur1_id',
        'utilisateur2_id'
    ];
    
    // Relations
    public function utilisateur1()
    {
        return $this->belongsTo(User::class, 'utilisateur1_id');
    }
    
    public function utilisateur2()
    {
        return $this->belongsTo(User::class, 'utilisateur2_id');
    }
    
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
    
    // Méthode helper pour récupérer le dernier message
    public function dernierMessage()
    {
        return $this->messages()->latest()->first();
    }
}
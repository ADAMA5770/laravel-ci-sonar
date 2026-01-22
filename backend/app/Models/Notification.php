<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'contenu',
        'type',
        'lu'
    ];
    
    protected $casts = [
        'lu' => 'boolean'
    ];
    
    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
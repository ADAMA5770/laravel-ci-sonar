<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('filieres', function (Blueprint $table) {
        $table->id();  // ← Colonne id (déjà là)
        
        // 👇 AJOUTE CES 2 LIGNES ICI
        $table->string('nom_filiere');
        $table->text('description')->nullable();
        
        $table->timestamps();  // ← created_at et updated_at (déjà là)
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filieres');
    }
};

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
    Schema::create('conversations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('utilisateur1_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('utilisateur2_id')->constrained('users')->onDelete('cascade');
        $table->timestamps();
        
        // Éviter les doublons (conversation A-B = conversation B-A)
        $table->unique(['utilisateur1_id', 'utilisateur2_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};

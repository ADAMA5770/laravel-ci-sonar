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
    Schema::create('notes_documents', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
        $table->integer('note'); // 1 à 5 étoiles
        $table->timestamps();
        
        // Un utilisateur ne peut noter qu'une seule fois le même document
        $table->unique(['user_id', 'document_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes_documents');
    }
};

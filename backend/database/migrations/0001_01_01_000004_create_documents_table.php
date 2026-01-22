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
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        // clé étrangère vers la table users
        //CASCADE : Si l'utilisateur est supprimé, ses documents sont aussi supprimés
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('titre');
        $table->text('description')->nullable();
        $table->enum('type_document', ['cours', 'TD', 'examen', 'corrige']);
        $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
        $table->string('niveau');
        $table->string('annee');
        $table->string('fichier_url');
        $table->integer('nombre_telechargements')->default(0);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};

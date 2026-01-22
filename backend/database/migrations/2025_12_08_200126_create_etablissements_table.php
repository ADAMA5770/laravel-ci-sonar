<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * explication de Blueprint: c est un outil de Laravel qui permet de définir la structure des tables de la base de données de manière fluide et expressive.
     *  exemple: 
     * 
     * 
     */
   public function up(): void
{
    Schema::create('etablissements', function (Blueprint $table) {
        $table->id();
        $table->string('nom_etablissement');
        $table->enum('type', ['CEM', 'Lycee', 'Universite']);
        $table->string('ville');
        $table->text('description')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etablissements');
    }
};

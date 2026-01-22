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
    Schema::create('annonces_cours', function (Blueprint $table) {
        $table->id();
        $table->foreignId('professeur_id')->constrained('users')->onDelete('cascade');
        $table->string('titre');
        $table->text('contenu');
        $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
        $table->string('niveau');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annonces_cours');
    }
};

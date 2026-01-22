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
        /*
            function (Blueprint $table) permet de définir la structure des tables de la base de données.
            ici, on crée trois tables: users, password_reset_tokens, et sessions.   

        */
       Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('nom');
    $table->string('prenom');
    $table->string('email')->unique();
    $table->string('telephone')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('profil_photo')->nullable();
    $table->enum('role', ['etudiant', 'professeur'])->default('etudiant');
    $table->foreignId('etablissement_id')->nullable()->constrained('etablissements')->onDelete('set null');
    $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
    $table->string('niveau')->nullable();
    $table->rememberToken();
    $table->timestamps();
});

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //dropIfExists supprime les tables si elles existent
        Schema::dropIfExists('users');
        // suppression de la table password_reset_tokens
        Schema::dropIfExists('password_reset_tokens');
        // suppression de la table sessions
        Schema::dropIfExists('sessions');
    }
};

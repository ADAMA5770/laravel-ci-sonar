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
    Schema::create('tutoriels_videos', function (Blueprint $table) {
        $table->id();
        $table->string('titre');
        $table->text('description')->nullable();
        $table->string('url_video');
        $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutoriels_videos');
    }
};

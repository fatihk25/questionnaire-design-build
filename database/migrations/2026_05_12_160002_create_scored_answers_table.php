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
        Schema::create('scored_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('respondent_id')->constrained()->onDelete('cascade');
            $table->foreignId('section_id')->constrained('question_sections')->onDelete('cascade');
            $table->foreignId('indicator_id')->constrained('risk_indicators')->onDelete('cascade');
            $table->tinyInteger('probability_score');
            $table->tinyInteger('impact_score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scored_answers');
    }
};

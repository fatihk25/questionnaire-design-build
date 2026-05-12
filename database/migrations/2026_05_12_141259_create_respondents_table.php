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
        Schema::create('respondents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('institution');
            $table->string('phone');
            $table->string('email');
            $table->string('age_group')->nullable();
            $table->string('education')->nullable();
            $table->string('stakeholder_position')->nullable();
            $table->string('position_other')->nullable();
            $table->string('construction_experience')->nullable();
            $table->string('db_experience')->nullable();
            $table->string('most_involved_phase')->nullable();
            $table->string('sector')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respondents');
    }
};

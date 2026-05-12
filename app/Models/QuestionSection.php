<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionSection extends Model
{
    protected $fillable = ['key', 'name', 'order'];

    public function scoredAnswers()
    {
        return $this->hasMany(ScoredAnswer::class, 'section_id');
    }
}

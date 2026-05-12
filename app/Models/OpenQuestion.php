<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpenQuestion extends Model
{
    protected $fillable = ['question_text', 'order'];

    public function openAnswers()
    {
        return $this->hasMany(OpenAnswer::class);
    }
}

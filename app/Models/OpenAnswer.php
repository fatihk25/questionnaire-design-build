<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpenAnswer extends Model
{
    protected $fillable = [
        'respondent_id',
        'open_question_id',
        'answer_text'
    ];

    public function respondent()
    {
        return $this->belongsTo(Respondent::class);
    }

    public function openQuestion()
    {
        return $this->belongsTo(OpenQuestion::class);
    }
}

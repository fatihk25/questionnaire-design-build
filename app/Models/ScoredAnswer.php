<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoredAnswer extends Model
{
    protected $fillable = [
        'respondent_id',
        'section_id',
        'indicator_id',
        'probability_score',
        'impact_score'
    ];

    public function respondent()
    {
        return $this->belongsTo(Respondent::class);
    }

    public function section()
    {
        return $this->belongsTo(QuestionSection::class, 'section_id');
    }

    public function indicator()
    {
        return $this->belongsTo(RiskIndicator::class, 'indicator_id');
    }
}

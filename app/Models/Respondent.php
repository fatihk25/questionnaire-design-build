<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
{
    protected $fillable = [
        'name',
        'institution',
        'phone',
        'email',
        'age_group',
        'education',
        'stakeholder_position',
        'position_other',
        'construction_experience',
        'db_experience',
        'most_involved_phase',
        'sector'
    ];

    public function scoredAnswers()
    {
        return $this->hasMany(ScoredAnswer::class);
    }

    public function openAnswers()
    {
        return $this->hasMany(OpenAnswer::class);
    }
}

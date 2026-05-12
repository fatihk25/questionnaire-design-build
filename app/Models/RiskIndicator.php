<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskIndicator extends Model
{
    protected $fillable = ['aspect_id', 'indicator_text', 'order'];

    public function aspect()
    {
        return $this->belongsTo(Aspect::class);
    }

    public function scoredAnswers()
    {
        return $this->hasMany(ScoredAnswer::class, 'indicator_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aspect extends Model
{
    protected $fillable = ['name', 'order'];

    public function riskIndicators()
    {
        return $this->hasMany(RiskIndicator::class);
    }
}

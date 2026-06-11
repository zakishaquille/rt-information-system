<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DueTypeRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];

    /**
     * Rates that are currently in effect:
     * effective_from <= today AND (effective_to IS NULL OR effective_to >= today).
     */
    public function scopeCurrent($query)
    {
        $today = now()->toDateString();
        return $query->where('effective_from', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('effective_to')->orWhere('effective_to', '>=', $today);
            });
    }

    /**
     * Rates that are scheduled but not yet in effect:
     * effective_from > today AND effective_to is null.
     */
    public function scopeUpcoming($query)
    {
        return $query->whereNull('effective_to')
            ->where('effective_from', '>', now()->toDateString());
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}

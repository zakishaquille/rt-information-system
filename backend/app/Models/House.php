<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class House extends Model
{
    /** @use HasFactory<\Database\Factories\HouseFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'address',
        'status',
    ];

    protected static function booted()
    {
        static::creating(function ($house) {
            if (empty($house->uuid)) {
                $house->uuid = (string) Str::uuid();
            }
        });
    }

    public function residents()
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
            ->withPivot('id', 'is_pic', 'moved_in_at', 'moved_out_at')
            ->withTimestamps();
    }
}

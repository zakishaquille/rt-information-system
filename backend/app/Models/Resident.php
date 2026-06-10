<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'full_name',
        'ktp_photo_path',
        'status',
        'phone_number',
        'is_married',
    ];

    protected $hidden = [
        'ktp_photo_path',
    ];

    protected $appends = ['ktp_photo_url'];

    public function getKtpPhotoUrlAttribute()
    {
        return $this->ktp_photo_path ? route('residents.ktp', $this->id) : null;
    }

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_residents')
            ->withPivot('id', 'is_pic', 'moved_in_at', 'moved_out_at')
            ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}

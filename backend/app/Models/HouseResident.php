<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseResident extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'is_pic',
        'moved_in_at',
        'moved_out_at',
    ];
}

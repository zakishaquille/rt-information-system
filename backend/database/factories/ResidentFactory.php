<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Resident>
 */
use Illuminate\Http\UploadedFile;

class ResidentFactory extends Factory
{
    protected $model = Resident::class;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'ktp_photo_path' => null,
            'status' => fake()->randomElement(['tetap', 'kontrak']),
            'phone_number' => fake()->numerify('08##########'),
            'is_married' => fake()->boolean(),
        ];
    }
}

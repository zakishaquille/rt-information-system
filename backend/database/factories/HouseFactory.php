<?php

namespace Database\Factories;

use App\Models\House;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<House>
 */
class HouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('?-##')),
            'address' => 'Jl. Danau Buyan ' . strtoupper($this->faker->randomLetter()) . ' No ' . $this->faker->numberBetween(1, 100),
            'status' => $this->faker->randomElement(['dihuni', 'tidak_dihuni']),
        ];
    }
}

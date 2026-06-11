<?php

namespace Database\Factories;

use App\Models\DueTypeRate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<DueTypeRate>
 */
class DueTypeRateFactory extends Factory
{
    protected $model = DueTypeRate::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'amount' => $this->faker->numberBetween(10000, 100000),
            'effective_from' => Carbon::now()->subMonths(6),
            'effective_to' => null,
        ];
    }
}

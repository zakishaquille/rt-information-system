<?php

namespace Database\Factories;

use App\Models\DueTypeRate;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'house_id' => House::factory(),
            'resident_id' => Resident::factory(),
            'due_type_rate_id' => DueTypeRate::factory(),
            'amount' => 100000.00,
            'period_month' => now()->format('Y-m'),
            'payment_date' => now()->toDateString(),
            'notes' => $this->faker->sentence(),
        ];
    }
}

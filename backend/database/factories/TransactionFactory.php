<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\TransactionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'transaction_category_id' => TransactionCategory::factory(),
            'date' => $this->faker->date(),
            'amount' => $this->faker->numberBetween(10000, 100000),
            'name' => $this->faker->words(3, true),
            'note' => $this->faker->sentence(),
        ];
    }
}

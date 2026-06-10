<?php

namespace Database\Seeders;

use App\Models\DueTypeRate;
use Illuminate\Database\Seeder;

class DueTypeRateSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = now()->subYear()->startOfMonth()->toDateString();

        DueTypeRate::updateOrCreate(
            ['name' => 'satpam'],
            [
                'amount'         => 100000.00,
                'effective_from' => $startDate,
                'effective_to'   => null,
            ]
        );

        DueTypeRate::updateOrCreate(
            ['name' => 'kebersihan'],
            [
                'amount'         => 15000.00,
                'effective_from' => $startDate,
                'effective_to'   => null,
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\House::factory()->count(15)->create([
            'status' => 'dihuni',
        ]);

        \App\Models\House::factory()->count(5)->create([
            'status' => 'tidak_dihuni',
        ]);
    }
}

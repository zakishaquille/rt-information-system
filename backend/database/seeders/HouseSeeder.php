<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\House;

class HouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (House::count() === 0) {
            House::factory()->count(15)->create([
                'status' => 'dihuni',
            ]);

            House::factory()->count(5)->create([
                'status' => 'tidak_dihuni',
            ]);
        }
    }
}

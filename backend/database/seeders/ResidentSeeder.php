<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\House;
use App\Models\Resident;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        $occupiedHouses = House::where('status', 'dihuni')->get();

        foreach ($occupiedHouses as $house) {
            // Assign 1 PIC per house
            $pic = Resident::factory()->create();
            $house->residents()->attach($pic->id, [
                'is_pic' => true,
                'moved_in_at' => now()->subMonths(rand(1, 12)),
            ]);

            // Assign 0-2 additional family members
            $familyCount = rand(0, 2);
            for ($i = 0; $i < $familyCount; $i++) {
                $member = Resident::factory()->create();
                $house->residents()->attach($member->id, [
                    'is_pic' => false,
                    'moved_in_at' => now()->subMonths(rand(1, 12)),
                ]);
            }
        }
    }
}

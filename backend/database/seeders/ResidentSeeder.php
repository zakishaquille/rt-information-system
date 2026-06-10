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
        if (Resident::count() === 0) {
            $houses = House::all();

            foreach ($houses as $house) {
                // Add historical resident (moved out)
                if (rand(0, 1) === 1) { // 50% chance to have a historical resident
                    $pastResidentCount = rand(1, 3);
                    for ($i = 0; $i < $pastResidentCount; $i++) {
                        $pastMember = Resident::factory()->create();
                        $monthsAgoMovedOut = rand(1, 11);
                        $monthsAgoMovedIn = $monthsAgoMovedOut + rand(6, 24);
                        
                        $house->residents()->attach($pastMember->id, [
                            'is_pic' => ($i === 0), // Maybe they were the PIC
                            'moved_in_at' => now()->subMonths($monthsAgoMovedIn),
                            'moved_out_at' => now()->subMonths($monthsAgoMovedOut),
                        ]);
                    }
                }

                if ($house->status === 'dihuni') {
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
    }
}

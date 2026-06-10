<?php

namespace Database\Seeders;

use App\Models\DueTypeRate;
use App\Models\House;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $houses = House::with('residents')->get();
        $rates = DueTypeRate::all();

        // Loop past 12 months, and current month
        $start = now()->subMonths(12)->startOfMonth();
        $end = now()->startOfMonth();

        $payments = [];

        foreach ($houses as $house) {
            $resident = $house->residents->first();
            if (!$resident) {
                continue;
            }

            $currentDate = $start->copy();

            // Determine if the house stops paying at some point (arrears)
            // 80% chance fully paid up to date, 20% chance stops paying at a random month
            $totalMonths = $start->diffInMonths($end);
            $stopPayingAfterMths = 999; // Never stops paying
            if (rand(1, 100) <= 20) {
                $stopPayingAfterMths = rand(0, $totalMonths - 1);
            }

            $mthIndex = 0;
            while ($currentDate <= $end) {
                $periodMonth = $currentDate->format('Y-m');

                if ($mthIndex <= $stopPayingAfterMths) {
                    $isPartialMonth = ($mthIndex === $stopPayingAfterMths && rand(1, 100) <= 50);
                    $ratesPaid = 0;

                    foreach ($rates as $rate) {
                        $rateStart = Carbon::parse($rate->effective_from)->startOfMonth();
                        $rateEnd = $rate->effective_to ? Carbon::parse($rate->effective_to)->endOfMonth() : null;

                        if ($currentDate >= $rateStart && ($rateEnd === null || $currentDate <= $rateEnd)) {
                            $payments[] = [
                                'house_id' => $house->id,
                                'resident_id' => $resident->id,
                                'due_type_rate_id' => $rate->id,
                                'amount' => $rate->amount,
                                'period_month' => $periodMonth,
                                'payment_date' => $currentDate->copy()->addDays(rand(1, 20))->toDateString(),
                                'notes' => 'Pembayaran ' . ucfirst($rate->name) . ' periode ' . $periodMonth,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                            
                            $ratesPaid++;
                            // For partial months, only pay the first active rate encountered
                            if ($isPartialMonth && $ratesPaid >= 1) {
                                break;
                            }
                        }
                    }
                }
                
                $mthIndex++;
                $currentDate->addMonth();
            }
        }

        // Insert in chunks to avoid memory issues
        $chunks = array_chunk($payments, 500);
        foreach ($chunks as $chunk) {
            Payment::insert($chunk);
        }
    }
}

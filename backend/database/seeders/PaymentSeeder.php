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
     *
     * Generates realistic payment data for all houses over the past 12 months.
     * - Clears existing payments first to prevent duplicates on re-seed.
     * - For each house+month, finds the single active rate per due type name (no duplicates).
     * - 80% of houses are fully paid; 20% stop paying at a random month.
     * - Payments are consecutive: once a house stops paying, all future months are unpaid.
     */
    public function run(): void
    {
        // Clear existing payment data to prevent duplicates
        Payment::truncate();

        $houses = House::with('residents')->get();
        $rates = DueTypeRate::orderBy('effective_from')->get();

        // Loop past 12 months + current month
        $start = now()->subMonths(12)->startOfMonth();
        $end = now()->startOfMonth();

        $payments = [];

        foreach ($houses as $house) {
            $resident = $house->residents->first();
            if (!$resident) {
                continue;
            }

            $currentDate = $start->copy();

            // 80% fully paid, 20% stops at a random month
            $totalMonths = $start->diffInMonths($end);
            $stopPayingAfterMths = 999;
            if (rand(1, 100) <= 20) {
                $stopPayingAfterMths = rand(0, $totalMonths - 1);
            }

            $mthIndex = 0;
            while ($currentDate <= $end) {
                $periodMonth = $currentDate->format('Y-m');

                if ($mthIndex <= $stopPayingAfterMths) {
                    $isPartialMonth = ($mthIndex === $stopPayingAfterMths && rand(1, 100) <= 50);

                    // Find the single active rate per due type name for this month
                    $activeRatesForMonth = $this->getActiveRatesForMonth($rates, $currentDate);
                    $ratesPaid = 0;

                    foreach ($activeRatesForMonth as $rate) {
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
                        // For partial months, only pay the first active rate
                        if ($isPartialMonth && $ratesPaid >= 1) {
                            break;
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

    /**
     * Get one active rate per due type name for a given month.
     *
     * When multiple rates exist for the same name (e.g. old and new tariff),
     * only the latest applicable one is returned to prevent duplicate payments.
     */
    private function getActiveRatesForMonth($allRates, Carbon $monthDate): array
    {
        $activeByName = [];

        foreach ($allRates as $rate) {
            $rateStart = Carbon::parse($rate->effective_from)->startOfMonth();
            $rateEnd = $rate->effective_to ? Carbon::parse($rate->effective_to)->endOfMonth() : null;

            // Skip aborted rates (effective_to < effective_from)
            if ($rate->effective_to && Carbon::parse($rate->effective_to) < Carbon::parse($rate->effective_from)) {
                continue;
            }

            // Check if rate is active for this month
            if ($monthDate >= $rateStart && ($rateEnd === null || $monthDate <= $rateEnd)) {
                // Keep the latest rate per name (overwrite older ones)
                $activeByName[$rate->name] = $rate;
            }
        }

        return array_values($activeByName);
    }
}

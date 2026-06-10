<?php

namespace App\Services;

use App\Models\House;
use App\Models\Payment;
use App\Models\DueTypeRate;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PaymentService
{
    /**
     * Get payment matrix for a given year.
     */
    public function getMatrix(int $year): array
    {
        $houses = $this->getHousesWithResidents();
        $rates = DueTypeRate::all();
        $groupedPayments = $this->getGroupedPayments($year);

        $matrix = [];

        foreach ($houses as $house) {
            $row = $this->buildHouseRow($house, $year, $rates, $groupedPayments);
            if ($row) {
                $matrix[] = $row;
            }
        }

        return $matrix;
    }

    public function getHousesWithResidents(): Collection
    {
        return House::with(['residents' => function ($q) {
            $q->whereNull('house_residents.moved_out_at');
        }])->get();
    }

    public function getGroupedPayments(int $year)
    {
        return Payment::with('resident')
            ->where('period_month', 'like', "$year-%")
            ->get()
            ->groupBy(function($p) {
                return $p->house_id . '_' . $p->period_month;
            });
    }

    public function buildHouseRow(House $house, int $year, Collection $rates, $groupedPayments): ?array
    {
        $resident = $house->residents->first(fn($r) => $r->pivot->is_pic) ?? $house->residents->first();
        if (!$resident) {
            return null;
        }

        $row = [
            'house_id' => $house->id,
            'house_code' => $house->code,
            'resident_id' => $resident->id,
            'resident_name' => $resident->full_name,
            'months' => [],
        ];

        for ($month = 1; $month <= 12; $month++) {
            $monthStr = str_pad((string)$month, 2, '0', STR_PAD_LEFT);
            $period = "$year-$monthStr";
            $housePayments = $groupedPayments->get($house->id . '_' . $period, collect());
            
            $row['months'][$monthStr] = $this->processMonth($year, $month, $rates, $housePayments);
        }

        return $row;
    }

    public function processMonth(int $year, int $month, Collection $rates, $housePayments): array
    {
        $monthStr = str_pad((string)$month, 2, '0', STR_PAD_LEFT);
        $period = "$year-$monthStr";
        $monthDate = Carbon::createFromFormat('Y-m', $period)->startOfMonth();

        $activeRates = $this->filterActiveRatesForMonth($rates, $monthDate);
        $activeRates = $this->deduplicateRates($activeRates, $housePayments);

        $details = [];
        $paidCount = 0;

        foreach ($activeRates as $rate) {
            $payment = $housePayments->firstWhere('due_type_rate_id', $rate->id);
            $details[] = [
                'payment_id' => $payment ? $payment->id : null,
                'due_type_rate_id' => $rate->id,
                'name' => $rate->name,
                'amount' => $rate->amount,
                'is_paid' => $payment !== null,
                'payment_date' => $payment ? $payment->payment_date->toDateString() : null,
                'payer_name' => $payment && $payment->resident ? $payment->resident->full_name : null,
            ];
            if ($payment) {
                $paidCount++;
            }
        }

        $status = 'UNPAID';
        if ($activeRates->count() > 0) {
            if ($paidCount === $activeRates->count()) {
                $status = 'PAID';
            } elseif ($paidCount > 0) {
                $status = 'PARTIAL';
            }
        } else {
            $status = 'NA'; // No active rates for this month
        }

        return [
            'status' => $status,
            'details' => $details,
        ];
    }

    public function filterActiveRatesForMonth(Collection $rates, Carbon $monthDate): Collection
    {
        return $rates->filter(function($r) use ($monthDate) {
            $effectiveFrom = Carbon::parse($r->effective_from);
            $effectiveTo = $r->effective_to ? Carbon::parse($r->effective_to) : null;

            // If a rate was superseded before it became active, skip it
            if ($effectiveTo && $effectiveTo < $effectiveFrom) {
                return false;
            }

            $start = $effectiveFrom->copy()->startOfMonth();
            $end = $effectiveTo ? $effectiveTo->copy()->endOfMonth() : null;
            
            return $monthDate >= $start && ($end === null || $monthDate <= $end);
        });
    }

    public function deduplicateRates(Collection $activeRates, $housePayments): Collection
    {
        $filteredRates = collect();
        foreach ($activeRates->groupBy('name') as $nameRates) {
            $paidRate = null;
            foreach ($nameRates as $rate) {
                if ($housePayments->firstWhere('due_type_rate_id', $rate->id)) {
                    $paidRate = $rate;
                    break;
                }
            }
            
            if ($paidRate) {
                $filteredRates->push($paidRate);
            } else {
                $filteredRates->push($nameRates->sortByDesc('effective_from')->first());
            }
        }
        return $filteredRates;
    }

    /**
     * Record a payment.
     */
    public function recordPayment(int $houseId, int $residentId, int $dueTypeRateId, string $periodMonth, string $paymentDate, ?string $notes = null): Payment
    {
        $rate = DueTypeRate::findOrFail($dueTypeRateId);

        return Payment::create([
            'house_id' => $houseId,
            'resident_id' => $residentId,
            'due_type_rate_id' => $dueTypeRateId,
            'amount' => $rate->amount,
            'period_month' => $periodMonth,
            'payment_date' => $paymentDate,
            'notes' => $notes,
        ]);
    }

    /**
     * Delete a payment record.
     */
    public function deletePayment(int $paymentId): void
    {
        $payment = Payment::findOrFail($paymentId);
        $payment->delete();
    }
}

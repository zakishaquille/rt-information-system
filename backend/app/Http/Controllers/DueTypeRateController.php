<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDueTypeRateRequest;
use App\Models\DueTypeRate;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DueTypeRateController extends Controller
{
    /**
     * List all rates (history), ordered newest first.
     */
    public function index()
    {
        $rates = DueTypeRate::orderByDesc('effective_from')->get();
        return response()->json(['data' => $rates]);
    }

    /**
     * Create a new rate for a due type.
     *
     * Closes all open rates (current or future-pending) for the same due type.
     * The previous rate ends the day before the new one's effective_from date.
     * If effective_from is today → rate is immediately active.
     * If effective_from is a future date → rate is "upcoming" until that date arrives.
     */
    public function store(StoreDueTypeRateRequest $request)
    {
        $validated = $request->validated();

        $rate = DB::transaction(function () use ($validated) {
            $newEffectiveFrom = $validated['effective_from'];
            $closeDate = Carbon::parse($newEffectiveFrom)->subDay()->toDateString();
            $today = now()->toDateString();

            // Close currently active rates (already in effect: effective_from <= today)
            DueTypeRate::where('name', $validated['name'])
                ->whereNull('effective_to')
                ->where('effective_from', '<=', $today)
                ->update(['effective_to' => $closeDate]);

            // Delete future/upcoming rates that never took effect (effective_from > today)
            DueTypeRate::where('name', $validated['name'])
                ->whereNull('effective_to')
                ->where('effective_from', '>', $today)
                ->delete();

            return DueTypeRate::create([
                'name'           => $validated['name'],
                'amount'         => $validated['amount'],
                'effective_from' => $newEffectiveFrom,
                'effective_to'   => null,
            ]);
        });

        return response()->json(['data' => $rate], 201);
    }

    /**
     * Delete a rate.
     *
     * Rules:
     * - Expired rates cannot be deleted (history must be preserved).
     * - Deleting a "mendatang" (upcoming) rate also reopens any predecessor
     *   whose effective_to was set by this rate (i.e. effective_to = this.effective_from - 1).
     * - Deleting an "aktif" rate simply removes it; no predecessor is restored
     *   because the intent is to retire the due type.
     */
    public function destroy(DueTypeRate $rate)
    {
        $today = now()->toDateString();
        $fromDate = $rate->effective_from->toDateString();
        $toDate = $rate->effective_to?->toDateString();

        // Determine status
        $isMendatang = $fromDate > $today;
        $isAktif = $fromDate <= $today && ($toDate === null || $toDate >= $today);

        if (!$isMendatang && !$isAktif) {
            return response()->json([
                'message' => 'Tarif yang sudah expired tidak dapat dihapus karena merupakan data historis.',
            ], 422);
        }

        DB::transaction(function () use ($rate, $isMendatang, $today) {
            if ($rate->payments()->exists()) {
                // Rate is used in payments, expire it instead of hard delete
                $rate->update(['effective_to' => Carbon::parse($today)->subDay()->toDateString()]);
            } else {
                if ($isMendatang) {
                    // Reopen the predecessor: find the rate for same name that was closed
                    // because effective_to == this.effective_from - 1
                    $expectedCloseDate = $rate->effective_from->subDay()->toDateString();

                    DueTypeRate::where('name', $rate->name)
                        ->where('effective_to', $expectedCloseDate)
                        ->where('id', '!=', $rate->id)
                        ->update(['effective_to' => null]);
                }

                $rate->delete();
            }
        });

        return response()->json(['message' => 'Tarif berhasil dihapus atau dihentikan.']);
    }
}

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
     * The new rate always takes effect immediately (today).
     * Any currently active rate for the same type is auto-expired.
     */
    public function store(StoreDueTypeRateRequest $request)
    {
        $validated = $request->validated();

        $rate = DB::transaction(function () use ($validated) {
            $today = now()->toDateString();
            $closeDate = Carbon::parse($today)->subDay()->toDateString();

            // Close currently active rates for this due type
            DueTypeRate::where('name', $validated['name'])
                ->whereNull('effective_to')
                ->update(['effective_to' => $closeDate]);

            return DueTypeRate::create([
                'name'           => $validated['name'],
                'amount'         => $validated['amount'],
                'effective_from' => $today,
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
     * - If the rate is used in payments, it is expired instead of hard-deleted.
     * - Otherwise it is hard-deleted.
     */
    public function destroy(DueTypeRate $rate)
    {
        $today = now()->toDateString();
        $toDate = $rate->effective_to?->toDateString();

        $isActive = ($toDate === null || $toDate >= $today);

        if (!$isActive) {
            return response()->json([
                'message' => 'Tarif yang sudah expired tidak dapat dihapus karena merupakan data historis.',
            ], 422);
        }

        DB::transaction(function () use ($rate, $today) {
            if ($rate->payments()->exists()) {
                // Rate is used in payments, expire it instead of hard delete
                $rate->update(['effective_to' => Carbon::parse($today)->subDay()->toDateString()]);
            } else {
                $rate->delete();
            }
        });

        return response()->json(['message' => 'Tarif berhasil dihapus.']);
    }
}

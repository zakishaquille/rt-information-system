<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    private PaymentService $service;

    public function __construct(PaymentService $service)
    {
        $this->service = $service;
    }

    public function getMatrix(Request $request)
    {
        $year = $request->input('year', date('Y'));
        
        $matrix = $this->service->getMatrix((int) $year);

        return response()->json(['data' => $matrix]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'due_type_rate_id' => 'required|exists:due_type_rates,id',
            'period_month' => 'required|date_format:Y-m',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $payment = DB::transaction(function () use ($validated) {
            return $this->service->recordPayment(
                $validated['house_id'],
                $validated['resident_id'],
                $validated['due_type_rate_id'],
                $validated['period_month'],
                $validated['payment_date'],
                $validated['notes'] ?? null
            );
        });

        return response()->json(['data' => $payment], 201);
    }

    public function destroy($id)
    {
        $this->service->deletePayment($id);

        return response()->json(null, 204);
    }
}

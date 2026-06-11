<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('category')->orderBy('date', 'desc')->get();
        return TransactionResource::collection($transactions);
    }

    public function summary(Request $request)
    {
        $month = $request->input('month'); // format: YYYY-MM
        
        $paymentsQuery = \App\Models\Payment::query();
        $transactionsQuery = \App\Models\Transaction::query();

        if ($month) {
            $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
            $end = \Carbon\Carbon::parse($month . '-01')->endOfMonth();

            $paymentsQuery->whereBetween('payment_date', [$start, $end]);
            $transactionsQuery->whereBetween('date', [$start, $end]);
        }

        $pemasukan_iuran = (float) $paymentsQuery->sum('amount');
        
        $pemasukan_lain = (float) (clone $transactionsQuery)->whereHas('category', function ($q) {
            $q->where('type', 'income');
        })->sum('amount');

        $pengeluaran = (float) (clone $transactionsQuery)->whereHas('category', function ($q) {
            $q->where('type', 'expense');
        })->sum('amount');

        if ($month) {
            $saldoEndDate = \Carbon\Carbon::parse($month . '-01')->endOfMonth();
            
            $totalPayments = \App\Models\Payment::where('payment_date', '<=', $saldoEndDate)->sum('amount');
            $totalIncomeTx = \App\Models\Transaction::whereHas('category', function ($q) {
                $q->where('type', 'income');
            })->where('date', '<=', $saldoEndDate)->sum('amount');
            $totalExpenseTx = \App\Models\Transaction::whereHas('category', function ($q) {
                $q->where('type', 'expense');
            })->where('date', '<=', $saldoEndDate)->sum('amount');
        } else {
            // Semua Waktu: no date bound
            $totalPayments = \App\Models\Payment::sum('amount');
            $totalIncomeTx = \App\Models\Transaction::whereHas('category', function ($q) {
                $q->where('type', 'income');
            })->sum('amount');
            $totalExpenseTx = \App\Models\Transaction::whereHas('category', function ($q) {
                $q->where('type', 'expense');
            })->sum('amount');
        }

        $saldo_sisa = (float) ($totalPayments + $totalIncomeTx - $totalExpenseTx);

        return response()->json([
            'data' => [
                'pemasukan_iuran' => $pemasukan_iuran,
                'pemasukan_lain' => $pemasukan_lain,
                'pengeluaran' => $pengeluaran,
                'saldo_sisa' => $saldo_sisa,
            ]
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $transaction = Transaction::create($request->validated());
        $transaction->load('category');
        return new TransactionResource($transaction);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load('category');
        return new TransactionResource($transaction);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $transaction->update($request->validated());
        $transaction->load('category');
        return new TransactionResource($transaction);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->noContent();
    }
}

<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class PublicReportService
{
    public function __construct(private DashboardService $dashboardService)
    {
    }

    public function getSummary(): array
    {
        return [
            'total_balance' => $this->dashboardService->getTotalBalance(),
            'chart_data' => $this->dashboardService->getChartData(12),
        ];
    }

    public function getMonthBreakdown(string $month): array
    {
        $start = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $end = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        // 1. Income from dues (payments)
        // Group by due_type_rate_id -> name
        $payments = Payment::with('dueTypeRate')
            ->whereBetween('payment_date', [$start, $end])
            ->get();
            
        $duesIncome = [];
        foreach ($payments as $payment) {
            $name = $payment->dueTypeRate->name ?? 'Unknown';
            if (!isset($duesIncome[$name])) {
                $duesIncome[$name] = 0;
            }
            $duesIncome[$name] += $payment->amount;
        }

        $formattedDuesIncome = [];
        foreach ($duesIncome as $name => $total) {
            $formattedDuesIncome[] = [
                'name' => $name,
                'total' => (float) $total,
            ];
        }

        // 2. Income from other sources (transactions where category type = income)
        $incomeTransactions = Transaction::with('category')
            ->whereHas('category', function ($q) {
                $q->where('type', 'income');
            })
            ->whereBetween('date', [$start, $end])
            ->get();

        $otherIncome = [];
        foreach ($incomeTransactions as $tx) {
            $name = $tx->category->name ?? 'Unknown';
            if (!isset($otherIncome[$name])) {
                $otherIncome[$name] = 0;
            }
            $otherIncome[$name] += $tx->amount;
        }

        $formattedOtherIncome = [];
        foreach ($otherIncome as $name => $total) {
            $formattedOtherIncome[] = [
                'name' => $name,
                'total' => (float) $total,
            ];
        }

        $totalIncome = collect($formattedDuesIncome)->sum('total') + collect($formattedOtherIncome)->sum('total');

        // 3. Expenses (transactions where category type = expense)
        $expenseTransactions = Transaction::with('category')
            ->whereHas('category', function ($q) {
                $q->where('type', 'expense');
            })
            ->whereBetween('date', [$start, $end])
            ->get();

        $expenses = [];
        foreach ($expenseTransactions as $tx) {
            $name = $tx->category->name ?? 'Unknown';
            if (!isset($expenses[$name])) {
                $expenses[$name] = 0;
            }
            $expenses[$name] += $tx->amount;
        }

        $formattedExpenses = [];
        foreach ($expenses as $name => $total) {
            $formattedExpenses[] = [
                'name' => $name,
                'total' => (float) $total,
            ];
        }

        $totalExpense = collect($formattedExpenses)->sum('total');

        return [
            'month' => $month,
            'income' => [
                'dues' => array_values($formattedDuesIncome),
                'other' => array_values($formattedOtherIncome),
                'total' => (float) $totalIncome,
            ],
            'expense' => [
                'categories' => array_values($formattedExpenses),
                'total' => (float) $totalExpense,
            ]
        ];
    }
}

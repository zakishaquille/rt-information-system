<?php

namespace App\Services;

use App\Models\House;
use App\Models\Payment;
use App\Models\Transaction;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'total_balance' => $this->getTotalBalance(),
            'current_month' => $this->getCurrentMonthSummary(),
            'house_occupancy' => $this->getHouseOccupancy(),
            'chart_data' => $this->getChartData(),
        ];
    }

    public function getHouseOccupancy(): array
    {
        return [
            'occupied' => House::where('status', 'dihuni')->count(),
            'empty' => House::where('status', 'tidak_dihuni')->count(),
            'total' => House::count(),
        ];
    }

    public function getTotalBalance(): float
    {
        $totalPayments = Payment::sum('amount');
        $totalIncomeTransactions = Transaction::whereHas('category', function ($q) {
            $q->where('type', 'income');
        })->sum('amount');
        $totalExpenseTransactions = Transaction::whereHas('category', function ($q) {
            $q->where('type', 'expense');
        })->sum('amount');

        return (float)($totalPayments + $totalIncomeTransactions - $totalExpenseTransactions);
    }

    public function getCurrentMonthSummary(): array
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $currentMonthPayments = Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('amount');
        $currentMonthIncomeTx = Transaction::whereHas('category', function ($q) {
            $q->where('type', 'income');
        })->whereBetween('date', [$startOfMonth, $endOfMonth])->sum('amount');
        $currentMonthExpenseTx = Transaction::whereHas('category', function ($q) {
            $q->where('type', 'expense');
        })->whereBetween('date', [$startOfMonth, $endOfMonth])->sum('amount');

        return [
            'income' => (float)($currentMonthPayments + $currentMonthIncomeTx),
            'expense' => (float)$currentMonthExpenseTx,
        ];
    }

    public function getChartData(int $monthsCount = 12): array
    {
        $chartData = [];
        for ($i = $monthsCount - 1; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $monthPayments = Payment::whereBetween('payment_date', [$start, $end])->sum('amount');
            $monthIncomeTx = Transaction::whereHas('category', function ($q) {
                $q->where('type', 'income');
            })->whereBetween('date', [$start, $end])->sum('amount');
            $monthExpenseTx = Transaction::whereHas('category', function ($q) {
                $q->where('type', 'expense');
            })->whereBetween('date', [$start, $end])->sum('amount');

            $chartData[] = [
                'month' => $month->format('Y-m'),
                'income' => (float)($monthPayments + $monthIncomeTx),
                'expense' => (float)$monthExpenseTx,
            ];
        }

        return $chartData;
    }
}

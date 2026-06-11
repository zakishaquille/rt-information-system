<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $startBalanceCat = TransactionCategory::where('name', 'Saldo Awal')->where('type', 'income')->first();
        $gajiCat = TransactionCategory::where('name', 'Gaji Satpam')->where('type', 'expense')->first();
        $listrikCat = TransactionCategory::where('name', 'Listrik')->where('type', 'expense')->first();
        $sumbanganCat = TransactionCategory::where('name', 'Sumbangan')->where('type', 'income')->first();

        if ($startBalanceCat) {
            Transaction::create([
                'transaction_category_id' => $startBalanceCat->id,
                'date' => now()->startOfMonth()->format('Y-m-d'),
                'amount' => 15000000,
                'name' => 'Saldo Awal',
                'note' => 'Saldo kas saat ini',
            ]);
        }

        if ($gajiCat) {
            Transaction::create([
                'transaction_category_id' => $gajiCat->id,
                'date' => now()->startOfMonth()->addDays(25)->format('Y-m-d'),
                'amount' => 3000000,
                'name' => 'Gaji Satpam Pak Budi',
                'note' => 'Gaji bulanan',
            ]);
        }

        if ($listrikCat) {
            Transaction::create([
                'transaction_category_id' => $listrikCat->id,
                'date' => now()->startOfMonth()->addDays(5)->format('Y-m-d'),
                'amount' => 500000,
                'name' => 'Token Listrik Pos Satpam',
                'note' => 'Token 500k',
            ]);
        }

        if ($sumbanganCat) {
            Transaction::create([
                'transaction_category_id' => $sumbanganCat->id,
                'date' => now()->startOfMonth()->addDays(10)->format('Y-m-d'),
                'amount' => 1000000,
                'name' => 'Sumbangan Warga Blok A',
                'note' => 'Untuk perbaikan gerbang',
            ]);
        }
    }
}

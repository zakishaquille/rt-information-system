<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::truncate(); // Clear existing transactions to prevent duplicates

        $startBalanceCat = TransactionCategory::where('name', 'Saldo Awal')->where('type', 'income')->first();
        $gajiCat = TransactionCategory::where('name', 'Gaji Satpam')->where('type', 'expense')->first();
        $kebersihanCat = TransactionCategory::where('name', 'Kebersihan')->where('type', 'expense')->first();
        $listrikCat = TransactionCategory::where('name', 'Listrik')->where('type', 'expense')->first();
        $sumbanganCat = TransactionCategory::where('name', 'Sumbangan')->where('type', 'income')->first();

        if ($startBalanceCat) {
            Transaction::create([
                'transaction_category_id' => $startBalanceCat->id,
                'date' => now()->subMonths(12)->startOfMonth()->format('Y-m-d'),
                'amount' => 15000000,
                'name' => 'Saldo Awal',
                'note' => 'Saldo kas awal',
            ]);
        }

        for ($i = 12; $i >= 0; $i--) {
            $month = now()->subMonths($i)->startOfMonth();

            if ($gajiCat) {
                $date = $month->copy()->addDays(24);
                if ($date <= now()) {
                    Transaction::create([
                        'transaction_category_id' => $gajiCat->id,
                        'date' => $date->format('Y-m-d'),
                        'amount' => 1500000,
                        'name' => 'Gaji Satpam Pak Budi',
                        'note' => 'Gaji bulanan',
                    ]);
                }
            }

            if ($kebersihanCat) {
                $date = $month->copy()->addDays(25);
                if ($date <= now()) {
                    Transaction::create([
                        'transaction_category_id' => $kebersihanCat->id,
                        'date' => $date->format('Y-m-d'),
                        'amount' => 200000,
                        'name' => 'Iuran Kebersihan Lingkungan',
                        'note' => 'Pembayaran petugas sampah',
                    ]);
                }
            }

            if ($listrikCat) {
                $date = $month->copy()->addDays(4);
                if ($date <= now()) {
                    Transaction::create([
                        'transaction_category_id' => $listrikCat->id,
                        'date' => $date->format('Y-m-d'),
                        'amount' => 25000,
                        'name' => 'Token Listrik Pos Satpam',
                        'note' => 'Token bulanan',
                    ]);
                }
            }

            if ($sumbanganCat && rand(1, 100) <= 30) {
                $date = $month->copy()->addDays(9);
                if ($date <= now()) {
                    Transaction::create([
                        'transaction_category_id' => $sumbanganCat->id,
                        'date' => $date->format('Y-m-d'),
                        'amount' => rand(5, 20) * 100000,
                        'name' => 'Sumbangan Warga',
                        'note' => 'Sumbangan sukarela',
                    ]);
                }
            }
        }
    }
}

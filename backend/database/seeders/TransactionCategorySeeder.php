<?php

namespace Database\Seeders;

use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class TransactionCategorySeeder extends Seeder
{
    public function run(): void
    {
        $expenseCategories = [
            'Gaji Satpam',
            'Listrik',
            'Perbaikan',
            'Kebersihan',
            'Kegiatan Warga',
            'Lain-lain',
        ];

        $incomeCategories = [
            'Saldo Awal',
            'Sumbangan',
            'Pemda',
            'Denda',
            'Lain-lain',
        ];

        $now = now();

        foreach ($expenseCategories as $name) {
            TransactionCategory::firstOrCreate([
                'type'       => 'expense',
                'name'       => $name,
            ]);
        }

        foreach ($incomeCategories as $name) {
            TransactionCategory::firstOrCreate([
                'type'       => 'income',
                'name'       => $name,
            ]);
        }
    }
}

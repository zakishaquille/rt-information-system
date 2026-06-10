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
            'Sumbangan',
            'Pemda',
            'Denda',
            'Lain-lain',
        ];

        $now = now();

        foreach ($expenseCategories as $name) {
            TransactionCategory::create([
                'type'       => 'expense',
                'name'       => $name,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($incomeCategories as $name) {
            TransactionCategory::create([
                'type'       => 'income',
                'name'       => $name,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\House;
use App\Models\Resident;
use App\Models\DueTypeRate;
use App\Models\Payment;
use App\Models\TransactionCategory;
use App\Models\Transaction;

class PublicReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_public_report_summary()
    {
        // Seed some data to get a non-zero balance
        $incomeCategory = TransactionCategory::factory()->create(['type' => 'income']);
        $expenseCategory = TransactionCategory::factory()->create(['type' => 'expense']);
        
        Transaction::factory()->create([
            'transaction_category_id' => $incomeCategory->id,
            'amount' => 500000,
            'date' => now()->subMonth(),
        ]);
        
        Transaction::factory()->create([
            'transaction_category_id' => $expenseCategory->id,
            'amount' => 200000,
            'date' => now()->subMonth(),
        ]);

        $response = $this->getJson('/api-public/reports');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_balance',
                    'chart_data' => [
                        '*' => [
                            'month',
                            'income',
                            'expense',
                            'balance'
                        ]
                    ]
                ]
            ]);
            
        $this->assertEquals(300000, $response->json('data.total_balance'));
    }

    public function test_it_returns_monthly_breakdown()
    {
        $dueType = DueTypeRate::factory()->create(['name' => 'Satpam']);
        $house = House::factory()->create();
        $resident = Resident::factory()->create();

        // Create payment for this month
        Payment::factory()->create([
            'house_id' => $house->id,
            'resident_id' => $resident->id,
            'due_type_rate_id' => $dueType->id,
            'amount' => 100000,
            'payment_date' => now(),
            'period_month' => now()->format('Y-m'),
        ]);

        $incomeCategory = TransactionCategory::factory()->create(['type' => 'income', 'name' => 'Donasi']);
        Transaction::factory()->create([
            'transaction_category_id' => $incomeCategory->id,
            'amount' => 50000,
            'date' => now(),
        ]);

        $expenseCategory = TransactionCategory::factory()->create(['type' => 'expense', 'name' => 'Listrik']);
        Transaction::factory()->create([
            'transaction_category_id' => $expenseCategory->id,
            'amount' => 20000,
            'date' => now(),
        ]);

        $month = now()->format('Y-m');
        $response = $this->getJson("/api-public/reports/breakdown?month={$month}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'month',
                    'income' => [
                        'dues' => [
                            '*' => [
                                'name',
                                'total',
                            ]
                        ],
                        'other' => [
                            '*' => [
                                'name',
                                'total',
                            ]
                        ],
                        'total',
                    ],
                    'expense' => [
                        'categories' => [
                            '*' => [
                                'name',
                                'total',
                            ]
                        ],
                        'total',
                    ],
                ]
            ]);

        // Assert calculation
        $this->assertEquals(150000, $response->json('data.income.total'));
        $this->assertEquals(20000, $response->json('data.expense.total'));
        $this->assertEquals(100000, $response->json('data.income.dues.0.total'));
        $this->assertEquals('Satpam', $response->json('data.income.dues.0.name'));
        $this->assertEquals(50000, $response->json('data.income.other.0.total'));
        $this->assertEquals('Donasi', $response->json('data.income.other.0.name'));
    }
}

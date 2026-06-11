<?php

namespace Tests\Feature;

use App\Models\DueTypeRate;
use App\Models\House;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_calculates_house_occupancy_correctly(): void
    {
        House::factory()->count(3)->create(['status' => 'dihuni']);
        House::factory()->count(2)->create(['status' => 'tidak_dihuni']);

        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('data.house_occupancy.occupied', 3)
            ->assertJsonPath('data.house_occupancy.empty', 2)
            ->assertJsonPath('data.house_occupancy.total', 5);
    }

    public function test_calculates_total_balance_correctly(): void
    {
        $house = House::factory()->create();
        $incomeCategory = TransactionCategory::factory()->create(['type' => 'income']);
        $expenseCategory = TransactionCategory::factory()->create(['type' => 'expense']);

        Payment::factory()->create(['house_id' => $house->id, 'amount' => 100000]);
        Transaction::factory()->create(['transaction_category_id' => $incomeCategory->id, 'amount' => 50000]);
        Transaction::factory()->create(['transaction_category_id' => $expenseCategory->id, 'amount' => 80000]);

        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/stats');

        // 100000 + 50000 - 80000 = 70000
        $response->assertStatus(200)
            ->assertJsonPath('data.total_balance', 70000);
    }

    public function test_calculates_current_month_summary_correctly(): void
    {
        $house = House::factory()->create();
        $incomeCategory = TransactionCategory::factory()->create(['type' => 'income']);
        $expenseCategory = TransactionCategory::factory()->create(['type' => 'expense']);

        $thisMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Current month
        Payment::factory()->create(['house_id' => $house->id, 'amount' => 100000, 'payment_date' => $thisMonth->copy()->startOfMonth()]);
        Transaction::factory()->create(['transaction_category_id' => $incomeCategory->id, 'amount' => 20000, 'date' => $thisMonth->copy()->startOfMonth()]);
        Transaction::factory()->create(['transaction_category_id' => $expenseCategory->id, 'amount' => 40000, 'date' => $thisMonth->copy()->startOfMonth()]);

        // Last month (should not be included in current_month summary)
        Payment::factory()->create(['house_id' => $house->id, 'amount' => 50000, 'payment_date' => $lastMonth->copy()->startOfMonth()]);

        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('data.current_month.income', 120000)
            ->assertJsonPath('data.current_month.expense', 40000);
    }

    public function test_calculates_chart_data_correctly(): void
    {
        $house = House::factory()->create();
        $incomeCategory = TransactionCategory::factory()->create(['type' => 'income']);
        $expenseCategory = TransactionCategory::factory()->create(['type' => 'expense']);

        $thisMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Current month
        Payment::factory()->create(['house_id' => $house->id, 'amount' => 100000, 'payment_date' => $thisMonth->copy()->startOfMonth()]);
        Transaction::factory()->create(['transaction_category_id' => $expenseCategory->id, 'amount' => 40000, 'date' => $thisMonth->copy()->startOfMonth()]);

        // Last month
        Transaction::factory()->create(['transaction_category_id' => $incomeCategory->id, 'amount' => 50000, 'date' => $lastMonth->copy()->startOfMonth()]);
        Transaction::factory()->create(['transaction_category_id' => $expenseCategory->id, 'amount' => 80000, 'date' => $lastMonth->copy()->startOfMonth()]);

        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/stats');

        $response->assertStatus(200);
        $this->assertCount(12, $response->json('data.chart_data'));

        $chartData = collect($response->json('data.chart_data'));
        
        $currentMonthData = $chartData->firstWhere('month', $thisMonth->format('Y-m'));
        $this->assertEquals(100000, $currentMonthData['income']);
        $this->assertEquals(40000, $currentMonthData['expense']);
        
        $lastMonthData = $chartData->firstWhere('month', $lastMonth->format('Y-m'));
        $this->assertEquals(50000, $lastMonthData['income']);
        $this->assertEquals(80000, $lastMonthData['expense']);
    }
}

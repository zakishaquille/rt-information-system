<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\TransactionCategory;
use App\Models\Transaction;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_list_transactions()
    {
        $category = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);
        Transaction::create([
            'transaction_category_id' => $category->id,
            'type' => 'expense',
            'date' => '2023-01-01',
            'amount' => 1000,
            'name' => 'Gaji January',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/transactions');
        $response->assertStatus(200)
                 ->assertJsonPath('data.0.name', 'Gaji January')
                 ->assertJsonPath('data.0.category.name', 'Gaji');
    }

    public function test_can_create_transaction()
    {
        $category = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);
        
        $payload = [
            'transaction_category_id' => $category->id,
            'date' => '2023-02-01',
            'amount' => 1500,
            'name' => 'Gaji February',
            'note' => 'Paid in full'
        ];

        $response = $this->actingAs($this->user)->postJson('/api/transactions', $payload);
        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Gaji February');

        $this->assertDatabaseHas('transactions', ['name' => 'Gaji February', 'amount' => 1500]);
    }

    public function test_can_update_transaction()
    {
        $category = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);
        $transaction = Transaction::create([
            'transaction_category_id' => $category->id,
            'date' => '2023-01-01',
            'amount' => 1000,
            'name' => 'Gaji January',
        ]);

        $payload = [
            'transaction_category_id' => $category->id,
            'date' => '2023-01-01',
            'amount' => 2000,
            'name' => 'Gaji January Updated',
            'note' => 'Correction'
        ];

        $response = $this->actingAs($this->user)->putJson("/api/transactions/{$transaction->id}", $payload);
        $response->assertStatus(200)
                 ->assertJsonPath('data.amount', 2000)
                 ->assertJsonPath('data.name', 'Gaji January Updated');

        $this->assertDatabaseHas('transactions', ['amount' => 2000]);
    }

    public function test_can_delete_transaction()
    {
        $category = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);
        $transaction = Transaction::create([
            'transaction_category_id' => $category->id,
            'type' => 'expense',
            'date' => '2023-01-01',
            'amount' => 1000,
            'name' => 'Gaji January',
        ]);

        $response = $this->actingAs($this->user)->deleteJson("/api/transactions/{$transaction->id}");
        $response->assertStatus(204);

        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }

    public function test_can_get_transaction_summary_semua_waktu()
    {
        \App\Models\Payment::factory()->create(['amount' => 500, 'payment_date' => '2023-01-15', 'period_month' => '2023-01']);
        \App\Models\Payment::factory()->create(['amount' => 500, 'payment_date' => '2023-02-15', 'period_month' => '2023-02']);
        
        $incomeCat = TransactionCategory::create(['name' => 'Donasi', 'type' => 'income']);
        $expenseCat = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);

        Transaction::create([
            'transaction_category_id' => $incomeCat->id,
            'type' => 'income',
            'date' => '2023-01-20',
            'amount' => 1000,
            'name' => 'Donasi warga'
        ]);
        
        Transaction::create([
            'transaction_category_id' => $expenseCat->id,
            'type' => 'expense',
            'date' => '2023-01-25',
            'amount' => 200,
            'name' => 'Beli sapu'
        ]);

        Transaction::create([
            'transaction_category_id' => $expenseCat->id,
            'type' => 'expense',
            'date' => '2023-02-05',
            'amount' => 300,
            'name' => 'Beli pel'
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/transactions/summary');
        
        $response->assertStatus(200)
                 ->assertJsonPath('data.pemasukan_iuran', 1000)
                 ->assertJsonPath('data.pemasukan_lain', 1000)
                 ->assertJsonPath('data.pengeluaran', 500)
                 ->assertJsonPath('data.saldo_sisa', 1500);
    }

    public function test_can_get_transaction_summary_filtered_by_month()
    {
        \App\Models\Payment::factory()->create(['amount' => 500, 'payment_date' => '2023-01-15', 'period_month' => '2023-01']);
        \App\Models\Payment::factory()->create(['amount' => 500, 'payment_date' => '2023-02-15', 'period_month' => '2023-02']);
        
        $incomeCat = TransactionCategory::create(['name' => 'Donasi', 'type' => 'income']);
        $expenseCat = TransactionCategory::create(['name' => 'Gaji', 'type' => 'expense']);

        Transaction::create([
            'transaction_category_id' => $incomeCat->id,
            'type' => 'income',
            'date' => '2023-01-20',
            'amount' => 1000,
            'name' => 'Donasi warga'
        ]);
        
        Transaction::create([
            'transaction_category_id' => $expenseCat->id,
            'type' => 'expense',
            'date' => '2023-01-25',
            'amount' => 200,
            'name' => 'Beli sapu'
        ]);

        Transaction::create([
            'transaction_category_id' => $expenseCat->id,
            'type' => 'expense',
            'date' => '2023-02-05',
            'amount' => 300,
            'name' => 'Beli pel'
        ]);

        // January Summary
        $responseJan = $this->actingAs($this->user)->getJson('/api/transactions/summary?month=2023-01');
        
        $responseJan->assertStatus(200)
                 ->assertJsonPath('data.pemasukan_iuran', 500)
                 ->assertJsonPath('data.pemasukan_lain', 1000)
                 ->assertJsonPath('data.pengeluaran', 200)
                 ->assertJsonPath('data.saldo_sisa', 1300); // 500 + 1000 - 200
                 
        // February Summary
        $responseFeb = $this->actingAs($this->user)->getJson('/api/transactions/summary?month=2023-02');
        
        $responseFeb->assertStatus(200)
                 ->assertJsonPath('data.pemasukan_iuran', 500) // Feb only
                 ->assertJsonPath('data.pemasukan_lain', 0) // Feb only
                 ->assertJsonPath('data.pengeluaran', 300) // Feb only
                 ->assertJsonPath('data.saldo_sisa', 1500); // Up to Feb: 1000 + 1000 - 500
    }
}

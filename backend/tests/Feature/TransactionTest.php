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
}

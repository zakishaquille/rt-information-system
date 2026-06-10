<?php

namespace Tests\Feature;

use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionCategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_transaction_categories()
    {
        TransactionCategory::insert([
            ['type' => 'expense', 'name' => 'Gaji Satpam', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'income', 'name' => 'Sumbangan', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/transaction-categories');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_expense_category()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/transaction-categories', [
            'type' => 'expense',
            'name' => 'Perbaikan Jalan',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.type', 'expense')
            ->assertJsonPath('data.name', 'Perbaikan Jalan');

        $this->assertDatabaseHas('transaction_categories', [
            'type' => 'expense',
            'name' => 'Perbaikan Jalan',
        ]);
    }

    public function test_can_create_income_category()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/transaction-categories', [
            'type' => 'income',
            'name' => 'Denda',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.type', 'income')
            ->assertJsonPath('data.name', 'Denda');
    }

    public function test_can_update_category_name()
    {
        $category = TransactionCategory::create(['type' => 'expense', 'name' => 'Old Name']);

        $response = $this->actingAs($this->admin)->putJson("/api/transaction-categories/{$category->id}", [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('transaction_categories', [
            'id'   => $category->id,
            'name' => 'New Name',
            'type' => 'expense', // type must not change
        ]);
    }

    public function test_can_delete_category()
    {
        $category = TransactionCategory::create(['type' => 'expense', 'name' => 'Temp Category']);

        $response = $this->actingAs($this->admin)->deleteJson("/api/transaction-categories/{$category->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('transaction_categories', ['id' => $category->id]);
    }

    public function test_creation_requires_valid_type()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/transaction-categories', [
            'type' => 'invalid',
            'name' => 'Some Category',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_creation_requires_name()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/transaction-categories', [
            'type' => 'expense',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_unauthenticated_cannot_access_categories()
    {
        $response = $this->getJson('/api/transaction-categories');
        $response->assertStatus(401);
    }
}

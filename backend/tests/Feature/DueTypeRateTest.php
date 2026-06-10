<?php

namespace Tests\Feature;

use App\Models\DueTypeRate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DueTypeRateTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_all_rates()
    {
        DueTypeRate::insert([
            ['name' => 'satpam', 'amount' => 100000, 'effective_from' => '2026-01-01', 'effective_to' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'kebersihan', 'amount' => 15000, 'effective_from' => '2026-01-01', 'effective_to' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/due-type-rates');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_new_rate_and_closes_previous()
    {
        $old = DueTypeRate::create([
            'name'           => 'satpam',
            'amount'         => 100000,
            'effective_from' => '2026-01-01',
            'effective_to'   => null,
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => 'satpam',
            'amount' => 120000,
        ]);

        $today = now()->toDateString();

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'satpam')
            ->assertJsonPath('data.amount', '120000.00')
            ->assertJsonPath('data.effective_from', $today . 'T00:00:00.000000Z')
            ->assertJsonPath('data.effective_to', null);

        // Old rate must be closed (effective_to = today - 1 day)
        $old->refresh();
        $this->assertNotNull($old->effective_to);
        $this->assertEquals(Carbon::parse($today)->subDay()->toDateString(), $old->effective_to->toDateString());
    }

    public function test_effective_from_is_always_today()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => 'satpam',
            'amount' => 100000,
        ]);

        $response->assertStatus(201);
        
        $rate = DueTypeRate::find($response->json('data.id'));
        $this->assertEquals(now()->toDateString(), $rate->effective_from->toDateString());
    }

    public function test_creating_rate_for_one_type_does_not_affect_other_type()
    {
        $kebersihan = DueTypeRate::create([
            'name'           => 'kebersihan',
            'amount'         => 15000,
            'effective_from' => '2026-01-01',
            'effective_to'   => null,
        ]);

        $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => 'satpam',
            'amount' => 100000,
        ]);

        // Kebersihan rate should remain open
        $kebersihan->refresh();
        $this->assertNull($kebersihan->effective_to);
    }

    public function test_rate_creation_rejects_empty_name()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => '',
            'amount' => 50000,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_create_rate_with_custom_due_type_name()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => 'sampah',
            'amount' => 10000,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'sampah');
    }

    public function test_rate_creation_requires_positive_amount()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'   => 'satpam',
            'amount' => -100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_can_delete_active_rate()
    {
        $rate = DueTypeRate::create([
            'name'           => 'satpam',
            'amount'         => 100000,
            'effective_from' => '2026-01-01',
            'effective_to'   => null,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/due-type-rates/{$rate->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('due_type_rates', ['id' => $rate->id]);
    }

    public function test_cannot_delete_expired_rate()
    {
        $rate = DueTypeRate::create([
            'name'           => 'satpam',
            'amount'         => 100000,
            'effective_from' => '2025-01-01',
            'effective_to'   => '2025-12-31',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/due-type-rates/{$rate->id}");

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Tarif yang sudah expired tidak dapat dihapus karena merupakan data historis.');

        $this->assertDatabaseHas('due_type_rates', ['id' => $rate->id]);
    }

    public function test_deleting_active_rate_used_in_payments_expires_it_instead_of_hard_delete()
    {
        $rate = DueTypeRate::create([
            'name'           => 'satpam',
            'amount'         => 100000,
            'effective_from' => '2026-01-01',
            'effective_to'   => null,
        ]);

        $house = \App\Models\House::factory()->create();
        $resident = \App\Models\Resident::factory()->create();

        \App\Models\Payment::create([
            'house_id' => $house->id,
            'resident_id' => $resident->id,
            'due_type_rate_id' => $rate->id,
            'amount' => 100000,
            'period_month' => '2026-01',
            'payment_date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/due-type-rates/{$rate->id}");

        $response->assertStatus(200);
        
        $rate->refresh();
        $this->assertEquals(now()->subDay()->toDateString(), $rate->effective_to->toDateString());
    }

    public function test_unauthenticated_cannot_access_rates()
    {
        $response = $this->getJson('/api/due-type-rates');
        $response->assertStatus(401);
    }

    public function test_effective_from_in_request_body_is_ignored()
    {
        // Even if client sends effective_from, server should use today
        $response = $this->actingAs($this->admin)->postJson('/api/due-type-rates', [
            'name'           => 'satpam',
            'amount'         => 100000,
            'effective_from' => '2099-12-31', // should be ignored
        ]);

        $response->assertStatus(201);
        $rate = DueTypeRate::find($response->json('data.id'));
        $this->assertEquals(now()->toDateString(), $rate->effective_from->toDateString());
    }
}

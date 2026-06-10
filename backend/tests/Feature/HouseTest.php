<?php

namespace Tests\Feature;

use App\Models\House;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class HouseTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        // Since it's admin routes, we need a user
        $this->admin = User::factory()->create();
    }

    public function test_can_list_houses()
    {
        House::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/houses');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_house_and_uuid_is_generated_automatically()
    {
        $houseData = [
            'code' => 'A1',
            'address' => 'Blok A No 1',
            'status' => 'dihuni'
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/houses', $houseData);

        $response->assertStatus(201)
            ->assertJsonPath('data.code', 'A1')
            ->assertJsonPath('data.address', 'Blok A No 1')
            ->assertJsonPath('data.status', 'dihuni');

        $this->assertDatabaseHas('houses', [
            'code' => 'A1'
        ]);

        // Check if UUID was generated
        $house = House::where('code', 'A1')->first();
        $this->assertNotNull($house->uuid);
    }

    public function test_cannot_create_house_with_duplicate_code()
    {
        House::factory()->create(['code' => 'A1']);

        $houseData = [
            'code' => 'A1',
            'address' => 'Blok A No 2',
            'status' => 'dihuni'
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/houses', $houseData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_can_update_house()
    {
        $house = House::factory()->create([
            'code' => 'A1',
            'address' => 'Blok A No 1',
            'status' => 'dihuni'
        ]);

        $updateData = [
            'code' => 'A1-UPDATED',
            'address' => 'Blok A No 1 Updated',
            'status' => 'tidak_dihuni'
        ];

        $response = $this->actingAs($this->admin)->putJson('/api/houses/' . $house->id, $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.code', 'A1-UPDATED')
            ->assertJsonPath('data.status', 'tidak_dihuni');

        $this->assertDatabaseHas('houses', [
            'id' => $house->id,
            'code' => 'A1-UPDATED',
            'status' => 'tidak_dihuni'
        ]);
    }

    public function test_can_show_house()
    {
        $house = House::factory()->create();

        $response = $this->actingAs($this->admin)->getJson('/api/houses/' . $house->id);

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $house->id)
            ->assertJsonPath('data.code', $house->code);
    }

    public function test_can_delete_house()
    {
        $house = House::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson('/api/houses/' . $house->id);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('houses', [
            'id' => $house->id
        ]);
    }

    public function test_can_assign_resident_to_house()
    {
        $house = House::factory()->create(['status' => 'tidak_dihuni']);
        $resident = \App\Models\Resident::factory()->create();

        $data = [
            'resident_id' => $resident->id,
            'is_pic' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson("/api/houses/{$house->id}/residents", $data);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Resident assigned successfully');

        $this->assertDatabaseHas('house_residents', [
            'house_id' => $house->id,
            'resident_id' => $resident->id,
            'is_pic' => true,
            'moved_out_at' => null,
        ]);

        $this->assertDatabaseHas('houses', [
            'id' => $house->id,
            'status' => 'dihuni'
        ]);
    }

    public function test_cannot_assign_same_resident_twice()
    {
        $house = House::factory()->create();
        $resident = \App\Models\Resident::factory()->create();

        $house->residents()->attach($resident->id, [
            'is_pic' => true,
            'moved_in_at' => now(),
        ]);

        $data = [
            'resident_id' => $resident->id,
            'is_pic' => false,
        ];

        $response = $this->actingAs($this->admin)->postJson("/api/houses/{$house->id}/residents", $data);

        $response->assertStatus(400)
            ->assertJsonPath('message', 'Resident is already assigned to this house');
    }

    public function test_can_unassign_resident_from_house_and_updates_moved_out_at()
    {
        $house = House::factory()->create(['status' => 'dihuni']);
        $resident = \App\Models\Resident::factory()->create();

        // Attach resident to house
        $house->residents()->attach($resident->id, [
            'is_pic' => true,
            'moved_in_at' => now()->subDays(10),
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/houses/{$house->id}/residents/{$resident->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Resident unassigned successfully');

        // Check pivot table
        $this->assertDatabaseHas('house_residents', [
            'house_id' => $house->id,
            'resident_id' => $resident->id,
        ]);

        $pivot = \Illuminate\Support\Facades\DB::table('house_residents')
            ->where('house_id', $house->id)
            ->where('resident_id', $resident->id)
            ->first();

        $this->assertNotNull($pivot->moved_out_at);

        // Check if house status updated to tidak_dihuni because no residents left
        $this->assertDatabaseHas('houses', [
            'id' => $house->id,
            'status' => 'tidak_dihuni'
        ]);
    }

    public function test_unassign_does_not_change_house_status_if_others_remain()
    {
        $house = House::factory()->create(['status' => 'dihuni']);
        $resident1 = \App\Models\Resident::factory()->create();
        $resident2 = \App\Models\Resident::factory()->create();

        $house->residents()->attach($resident1->id, ['moved_in_at' => now()]);
        $house->residents()->attach($resident2->id, ['moved_in_at' => now()]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/houses/{$house->id}/residents/{$resident1->id}");

        $response->assertStatus(200);

        // House should still be dihuni
        $this->assertDatabaseHas('houses', [
            'id' => $house->id,
            'status' => 'dihuni'
        ]);
    }

    public function test_can_fetch_house_with_history_and_payments()
    {
        $house = House::factory()->create();
        $resident = \App\Models\Resident::factory()->create();

        $house->residents()->attach($resident->id, [
            'is_pic' => true,
            'moved_in_at' => now()->subMonths(2),
            'moved_out_at' => now()->subDays(5),
        ]);

        $category = \App\Models\TransactionCategory::create([
            'type' => 'income',
            'name' => 'Iuran Warga Test'
        ]);
        
        $rate = \App\Models\DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => now()->toDateString(),
        ]);

        \App\Models\Payment::create([
            'house_id' => $house->id,
            'resident_id' => $resident->id,
            'due_type_rate_id' => $rate->id,
            'amount' => 100000,
            'period_month' => now()->format('Y-m'),
            'payment_date' => now(),
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/houses/' . $house->id);

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $house->id)
            ->assertJsonPath('data.residents.0.id', $resident->id)
            ->assertJsonPath('data.payments.0.amount', '100000.00')
            ->assertJsonPath('data.payments.0.due_type_rate.id', $rate->id)
            ->assertJsonPath('data.payments.0.resident.id', $resident->id);
    }
}

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
}

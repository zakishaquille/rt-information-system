<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\House;
use App\Models\Resident;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ResidentTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_residents()
    {
        // We'll test this after we have the factory, for now just check endpoint
        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/residents');
        $response->assertStatus(200);
    }

    public function test_can_create_resident_with_ktp()
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->image('ktp.jpg');

        $data = [
            'full_name' => 'Budi Santoso',
            'status' => 'tetap',
            'phone_number' => '081234567890',
            'is_married' => true,
            'ktp_photo' => $file,
        ];

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/residents', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Budi Santoso')
            ->assertJsonPath('data.status', 'tetap');

        $this->assertDatabaseHas('residents', [
            'full_name' => 'Budi Santoso',
            'phone_number' => '081234567890',
        ]);

        // Check if file was stored in private disk
        $resident = Resident::first();
        $this->assertNotNull($resident->ktp_photo_path);
        Storage::disk('local')->assertExists($resident->ktp_photo_path);
    }

    public function test_can_create_resident_without_ktp()
    {
        $data = [
            'full_name' => 'Budi Santoso',
            'status' => 'tetap',
            'phone_number' => '081234567890',
            'is_married' => true,
            // ktp_photo omitted
        ];

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/residents', $data);
        $response->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Budi Santoso');
            
        $this->assertDatabaseHas('residents', [
            'full_name' => 'Budi Santoso',
            'ktp_photo_path' => null,
        ]);
    }

    public function test_can_show_resident()
    {
        $resident = Resident::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/residents/' . $resident->id);

        $response->assertStatus(200)
            ->assertJsonPath('data.full_name', $resident->full_name);
    }

    public function test_can_update_resident_without_ktp()
    {
        $resident = Resident::factory()->create(['full_name' => 'Old Name']);

        $data = [
            'full_name' => 'New Name',
            'status' => $resident->status,
            'phone_number' => $resident->phone_number,
            'is_married' => $resident->is_married,
        ];

        $response = $this->actingAs($this->admin, 'sanctum')->putJson('/api/residents/' . $resident->id, $data);

        $response->assertStatus(200)
            ->assertJsonPath('data.full_name', 'New Name');

        $this->assertDatabaseHas('residents', [
            'id' => $resident->id,
            'full_name' => 'New Name',
        ]);
    }

    public function test_can_update_resident_with_new_ktp()
    {
        Storage::fake('local');
        $oldFile = UploadedFile::fake()->image('old.jpg');
        $oldPath = $oldFile->store('ktp_photos', 'local');
        
        $resident = Resident::factory()->create([
            'full_name' => 'Old Name',
            'ktp_photo_path' => $oldPath
        ]);

        $newFile = UploadedFile::fake()->image('new.jpg');

        $data = [
            'full_name' => 'New Name',
            'status' => $resident->status,
            'phone_number' => $resident->phone_number,
            'is_married' => $resident->is_married,
            'ktp_photo' => $newFile,
            '_method' => 'PUT',
        ];

        $response = $this->actingAs($this->admin, 'sanctum')->post('/api/residents/' . $resident->id, $data, [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.full_name', 'New Name');

        $resident->refresh();
        $this->assertNotEquals($oldPath, $resident->ktp_photo_path);
        Storage::disk('local')->assertExists($resident->ktp_photo_path);
    }

    public function test_can_delete_resident()
    {
        $resident = Resident::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')->deleteJson('/api/residents/' . $resident->id);

        $response->assertStatus(204);

        $this->assertSoftDeleted('residents', [
            'id' => $resident->id,
        ]);
    }

    public function test_can_download_ktp_photo()
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->image('ktp.jpg');
        $path = $file->store('ktp_photos', 'local');
        
        $resident = Resident::factory()->create([
            'ktp_photo_path' => $path
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->get('/api/residents/' . $resident->id . '/ktp');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'image/jpeg');
    }

    public function test_unauthenticated_user_cannot_access_endpoints()
    {
        $response = $this->getJson('/api/residents');
        $response->assertStatus(401);
    }

    public function test_validates_required_fields_on_create()
    {
        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/residents', []);
        
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['full_name', 'status', 'phone_number']);
    }

    public function test_cannot_delete_resident_still_assigned_to_house()
    {
        $house = House::factory()->create();
        $resident = Resident::factory()->create();
        
        $house->residents()->attach($resident->id, ['is_pic' => true]);

        $response = $this->actingAs($this->admin, 'sanctum')->deleteJson('/api/residents/' . $resident->id);

        $response->assertStatus(400)
            ->assertJsonPath('message', 'Cannot delete a resident assigned to a house');

        $this->assertDatabaseHas('residents', ['id' => $resident->id]);
    }
}

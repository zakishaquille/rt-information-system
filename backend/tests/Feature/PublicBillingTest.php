<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\House;
use App\Models\Resident;
use App\Models\DueTypeRate;
use App\Models\Payment;
use Carbon\Carbon;

class PublicBillingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_billing_endpoint_returns_sanitized_data()
    {
        // 1. Create a due type rate
        $dueType = DueTypeRate::factory()->create([
            'name' => 'Satpam',
            'amount' => 100000,
        ]);

        // 2. Create a house
        $house = House::factory()->create([
            'code' => 'A1',
            'address' => 'Jalan A1',
            'status' => 'dihuni',
        ]);

        // 3. Create a resident and assign as PIC
        $resident = Resident::factory()->create([
            'full_name' => 'John Doe',
            'ktp_photo_path' => 'private/ktp/john.jpg',
            'phone_number' => '081234567890',
        ]);

        $house->residents()->attach($resident->id, [
            'is_pic' => true,
            'moved_in_at' => Carbon::now()->subMonths(2),
        ]);

        // 4. Create a payment for this year
        $currentYear = Carbon::now()->year;
        Payment::factory()->create([
            'house_id' => $house->id,
            'resident_id' => $resident->id,
            'due_type_rate_id' => $dueType->id,
            'amount' => 100000,
            'period_month' => "{$currentYear}-01",
            'payment_date' => Carbon::parse("{$currentYear}-01-10"),
        ]);

        // 5. Test public endpoint
        $response = $this->getJson("/api-public/houses/{$house->uuid}");

        $response->assertStatus(200);

        // Verify structure and sanitized data
        $response->assertJsonStructure([
            'data' => [
                'uuid',
                'code',
                'address',
                'status',
                'pic_name',
                'total_arrears',
                'payment_matrix'
            ]
        ]);

        // Verify specific sanitized data
        $response->assertJsonPath('data.pic_name', 'John Doe');
        $responseData = $response->json('data');
        $this->assertArrayHasKey('total_arrears', $responseData);

        $response->assertJsonPath('data.payment_matrix.01.details.0.amount', "100000.00");
        $response->assertJsonPath('data.payment_matrix.01.details.0.is_paid', true);
        $response->assertJsonPath('data.payment_matrix.01.details.0.name', 'Satpam');

        // Verify sensitive data is NOT exposed
        $responseContent = $response->getContent();
        $this->assertStringNotContainsString('ktp_photo_path', $responseContent);
        $this->assertStringNotContainsString('081234567890', $responseContent);
        $this->assertStringNotContainsString('private/ktp/john.jpg', $responseContent);
        $this->assertStringNotContainsString('"id":', $responseContent); // internal IDs shouldn't be exposed
    }

    public function test_public_billing_endpoint_returns_404_for_invalid_uuid()
    {
        $response = $this->getJson('/api-public/houses/invalid-uuid');
        $response->assertStatus(404);
    }
}

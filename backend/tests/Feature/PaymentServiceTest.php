<?php

namespace Tests\Feature;

use App\Models\DueTypeRate;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;
use App\Services\PaymentService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    private PaymentService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PaymentService();
    }

    public function test_record_payment_creates_payment()
    {
        $house = House::factory()->create();
        $resident = Resident::factory()->create();
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => now()->subMonth()]);

        $rate = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-01',
        ]);

        $payment = $this->service->recordPayment(
            $house->id,
            $resident->id,
            $rate->id,
            '2026-01',
            '2026-01-15',
            'Lunas bos'
        );

        $this->assertInstanceOf(Payment::class, $payment);
        $this->assertEquals(100000, $payment->amount);
        $this->assertEquals('Lunas bos', $payment->notes);
        
        $this->assertDatabaseHas('payments', [
            'house_id' => $house->id,
            'period_month' => '2026-01',
            'due_type_rate_id' => $rate->id,
        ]);
    }

    public function test_get_matrix_returns_correct_structure()
    {
        Carbon::setTestNow('2026-06-10 10:00:00');

        $house = House::factory()->create(['code' => 'A1']);
        $resident = Resident::factory()->create(['full_name' => 'Budi']);
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => '2025-01-01']);

        $rate1 = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-01',
        ]);
        
        $rate2 = DueTypeRate::create([
            'name' => 'kebersihan',
            'amount' => 15000,
            'effective_from' => '2026-01-01',
        ]);

        $this->service->recordPayment($house->id, $resident->id, $rate1->id, '2026-01', '2026-01-10');
        $this->service->recordPayment($house->id, $resident->id, $rate2->id, '2026-01', '2026-01-10');

        $this->service->recordPayment($house->id, $resident->id, $rate1->id, '2026-02', '2026-02-10');

        $matrix = $this->service->getMatrix(2026);

        $this->assertCount(1, $matrix);
        $row = $matrix[0];

        $this->assertEquals($house->id, $row['house_id']);
        $this->assertEquals($house->uuid, $row['house_uuid']);
        $this->assertEquals('A1', $row['house_code']);
        $this->assertEquals('Budi', $row['resident_name']);

        $this->assertEquals('PAID', $row['months']['01']['status']);
        $this->assertCount(2, $row['months']['01']['details']);

        $this->assertEquals('PARTIAL', $row['months']['02']['status']);

        $this->assertEquals('UNPAID', $row['months']['03']['status']);
    }

    public function test_get_matrix_does_not_duplicate_rate_if_rate_is_updated_after_payment()
    {
        Carbon::setTestNow('2026-06-10 10:00:00');

        $house = House::factory()->create(['code' => 'A1']);
        $resident = Resident::factory()->create(['full_name' => 'Budi']);
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => '2025-01-01']);

        // Old rate
        $rate1 = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-01',
            'effective_to' => '2026-01-14',
        ]);
        
        // Paid using old rate
        $this->service->recordPayment($house->id, $resident->id, $rate1->id, '2026-01', '2026-01-10');

        // New rate comes in middle of the month
        $rate2 = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 150000,
            'effective_from' => '2026-01-15',
        ]);

        $matrix = $this->service->getMatrix(2026);
        $row = $matrix[0];

        // Should still be PAID and only have 1 detail for 'satpam'
        $this->assertEquals('PAID', $row['months']['01']['status']);
        $this->assertCount(1, $row['months']['01']['details']);
        $this->assertEquals(100000, $row['months']['01']['details'][0]['amount']);
        $this->assertTrue($row['months']['01']['details'][0]['is_paid']);
    }

    public function test_get_matrix_skips_house_without_residents()
    {
        $house = House::factory()->create(['code' => 'EMPTY1']);
        
        $matrix = $this->service->getMatrix(2026);
        
        $this->assertEmpty(collect($matrix)->where('house_id', $house->id));
    }

    public function test_get_matrix_handles_house_without_pic()
    {
        $house = House::factory()->create(['code' => 'NOPIC1']);
        $resident = Resident::factory()->create(['full_name' => 'Budi No PIC']);
        // Attach without is_pic
        $house->residents()->attach($resident->id, ['is_pic' => false, 'moved_in_at' => '2025-01-01']);
        
        $matrix = $this->service->getMatrix(2026);
        $row = collect($matrix)->firstWhere('house_id', $house->id);
        
        $this->assertNotNull($row);
        $this->assertEquals('Budi No PIC', $row['resident_name']);
    }

    public function test_get_matrix_returns_na_when_no_active_rates()
    {
        $house = House::factory()->create();
        $resident = Resident::factory()->create();
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => '2025-01-01']);

        // Rate only starts in Feb
        DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-02-01',
        ]);

        $matrix = $this->service->getMatrix(2026);
        $row = collect($matrix)->firstWhere('house_id', $house->id);

        $this->assertEquals('NA', $row['months']['01']['status']);
        $this->assertEquals('UNPAID', $row['months']['02']['status']);
    }

    public function test_filter_active_rates_for_month()
    {
        $rate1 = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-15',
            'effective_to' => '2026-02-15'
        ]);

        $rates = DueTypeRate::all();
        
        // Jan should include rate1
        $jan = $this->service->filterActiveRatesForMonth($rates, Carbon::parse('2026-01-01'));
        $this->assertTrue($jan->contains('id', $rate1->id));

        // Feb should include rate1
        $feb = $this->service->filterActiveRatesForMonth($rates, Carbon::parse('2026-02-01'));
        $this->assertTrue($feb->contains('id', $rate1->id));

        // Mar should NOT include rate1
        $mar = $this->service->filterActiveRatesForMonth($rates, Carbon::parse('2026-03-01'));
        $this->assertFalse($mar->contains('id', $rate1->id));
    }

    public function test_deduplicate_rates_prioritizes_paid_rate()
    {
        $rateOld = DueTypeRate::create(['name' => 'satpam', 'amount' => 100, 'effective_from' => '2026-01-01', 'effective_to' => '2026-01-14']);
        $rateNew = DueTypeRate::create(['name' => 'satpam', 'amount' => 200, 'effective_from' => '2026-01-15']);
        
        $activeRates = collect([$rateOld, $rateNew]);

        // Mock a payment for rateOld
        $housePayments = collect([
            (object)['due_type_rate_id' => $rateOld->id]
        ]);

        $filtered = $this->service->deduplicateRates($activeRates, $housePayments);

        $this->assertCount(1, $filtered);
        $this->assertEquals($rateOld->id, $filtered->first()->id);

        // If no payment, it should prioritize the latest rate (rateNew)
        $filteredNoPayment = $this->service->deduplicateRates($activeRates, collect());
        $this->assertCount(1, $filteredNoPayment);
        $this->assertEquals($rateNew->id, $filteredNoPayment->first()->id);
    }

    public function test_filter_active_rates_ignores_aborted_future_rates()
    {
        // Rate that was created for the future but aborted before it took effect
        $abortedRate = DueTypeRate::create([
            'name' => 'maintenance',
            'amount' => 15000,
            'effective_from' => '2026-06-13',
            'effective_to' => '2026-06-09'
        ]);

        $rates = collect([$abortedRate]);
        
        $active = $this->service->filterActiveRatesForMonth($rates, Carbon::parse('2026-06-01'));
        
        $this->assertEmpty($active);
    }

    public function test_record_annual_payment_creates_12_records()
    {
        $house = House::factory()->create();
        $resident = Resident::factory()->create();
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => now()->subMonth()]);

        $rate = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-01',
        ]);

        $this->service->recordAnnualPayment(
            $house->id,
            $resident->id,
            $rate->id,
            2026,
            '2026-01-15',
            'Bayar setahun bos'
        );

        $this->assertDatabaseCount('payments', 12);
        
        // Assert first and last months
        $this->assertDatabaseHas('payments', [
            'house_id' => $house->id,
            'period_month' => '2026-01',
            'due_type_rate_id' => $rate->id,
            'amount' => 100000,
            'notes' => 'Bayar setahun bos',
        ]);
        
        $this->assertDatabaseHas('payments', [
            'house_id' => $house->id,
            'period_month' => '2026-12',
            'due_type_rate_id' => $rate->id,
        ]);
    }

    public function test_record_annual_payment_skips_existing_payments()
    {
        $house = House::factory()->create();
        $resident = Resident::factory()->create();
        $house->residents()->attach($resident->id, ['is_pic' => true, 'moved_in_at' => now()->subMonth()]);

        $rate = DueTypeRate::create([
            'name' => 'satpam',
            'amount' => 100000,
            'effective_from' => '2026-01-01',
        ]);

        // Already paid for January and March
        $this->service->recordPayment($house->id, $resident->id, $rate->id, '2026-01', '2026-01-10', 'Already paid Jan');
        $this->service->recordPayment($house->id, $resident->id, $rate->id, '2026-03', '2026-03-10', 'Already paid Mar');

        // Pay annual
        $this->service->recordAnnualPayment(
            $house->id,
            $resident->id,
            $rate->id,
            2026,
            '2026-04-15',
            'Bayar sisa tahun'
        );

        $this->assertDatabaseCount('payments', 12);
        
        // January should retain its old note
        $this->assertDatabaseHas('payments', [
            'period_month' => '2026-01',
            'notes' => 'Already paid Jan'
        ]);

        // February should have new note
        $this->assertDatabaseHas('payments', [
            'period_month' => '2026-02',
            'notes' => 'Bayar sisa tahun'
        ]);
    }
}

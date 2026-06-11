<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicHouseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the current PIC from the loaded relation
        $currentPic = $this->whenLoaded('residents', function () {
            return $this->residents->first();
        });

        $paymentMatrix = $this->payment_matrix ?? [];
        $totalArrears = 0;
        
        $currentMonth = (int) \Carbon\Carbon::now()->format('m');
        
        foreach ($paymentMatrix as $monthKey => $monthData) {
            $m = (int) $monthKey;
            if ($m <= $currentMonth && isset($monthData['details'])) {
                foreach ($monthData['details'] as $detail) {
                    if (!$detail['is_paid']) {
                        $totalArrears += (float) $detail['amount'];
                    }
                }
            }
        }

        return [
            'uuid' => $this->uuid,
            'code' => $this->code,
            'address' => $this->address,
            'status' => $this->status,
            'pic_name' => $currentPic ? $currentPic->full_name : null,
            'total_arrears' => (string) $totalArrears,
            'payment_matrix' => (object) $paymentMatrix,
        ];
    }
}

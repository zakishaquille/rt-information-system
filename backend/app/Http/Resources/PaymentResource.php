<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'house_id' => $this->house_id,
            'resident_id' => $this->resident_id,
            'due_type_rate_id' => $this->due_type_rate_id,
            'period_month' => $this->period_month,
            'payment_date' => $this->payment_date,
            'amount' => $this->amount,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'resident' => new ResidentResource($this->whenLoaded('resident')),
            'due_type_rate' => new DueTypeRateResource($this->whenLoaded('dueTypeRate')),
        ];
    }
}

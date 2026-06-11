<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResidentResource extends JsonResource
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
            'name' => $this->full_name,
            'full_name' => $this->full_name,
            'status' => $this->status,
            'phone_number' => $this->phone_number,
            'is_married' => $this->is_married,
            'ktp_photo_url' => $this->ktp_photo_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'pivot' => $this->whenPivotLoaded('house_residents', function () {
                return [
                    'is_pic' => $this->pivot->is_pic,
                    'moved_in_at' => $this->pivot->moved_in_at,
                    'moved_out_at' => $this->pivot->moved_out_at,
                ];
            }),
            'houses' => HouseResource::collection($this->whenLoaded('houses')),
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Http\Resources\PublicHouseResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Services\PaymentService;

class PublicHouseController extends Controller
{
    /**
     * Display the specified house billing info publicly.
     */
    public function show($uuid, PaymentService $paymentService)
    {
        $currentYear = Carbon::now()->year;
        
        $house = House::with([
            'residents' => function ($query) {
                $query->wherePivot('is_pic', true)
                      ->wherePivotNull('moved_out_at');
            }
        ])->where('uuid', $uuid)->firstOrFail();

        $houseMatrix = $paymentService->getHouseMatrix($house, $currentYear);
        
        // Pass the matrix data to the resource
        $house->setAttribute('payment_matrix', $houseMatrix ? $houseMatrix['months'] : []);

        return new PublicHouseResource($house);
    }
}

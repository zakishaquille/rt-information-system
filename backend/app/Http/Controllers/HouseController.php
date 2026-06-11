<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;
use App\Http\Resources\HouseResource;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with('residents')->latest()->get();
        return HouseResource::collection($houses);
    }

    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());
        return new HouseResource($house);
    }

    public function show(House $house)
    {
        $house->load([
            'residents' => function ($q) {
                $q->orderBy('house_residents.moved_in_at', 'desc');
            },
            'payments' => function ($q) {
                $q->orderBy('period_month', 'desc')->orderBy('created_at', 'desc');
            },
            'payments.dueTypeRate',
            'payments.resident',
        ]);
        return new HouseResource($house);
    }

    public function update(UpdateHouseRequest $request, House $house)
    {
        $house->update($request->validated());
        return new HouseResource($house);
    }

    public function destroy(House $house)
    {
        $house->delete();
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with('residents')->get();
        return response()->json(['data' => $houses]);
    }

    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());
        return response()->json(['data' => $house], 201);
    }

    public function show(House $house)
    {
        return response()->json(['data' => $house]);
    }

    public function update(UpdateHouseRequest $request, House $house)
    {
        $house->update($request->validated());
        return response()->json(['data' => $house]);
    }

    public function destroy(House $house)
    {
        $house->delete();
        return response()->json(null, 204);
    }
}

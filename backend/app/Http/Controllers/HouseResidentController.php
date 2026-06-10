<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\Resident;
use Illuminate\Http\Request;

class HouseResidentController extends Controller
{
    public function store(Request $request, House $house)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'is_pic' => 'boolean',
        ]);

        $residentId = $validated['resident_id'];
        
        // Prevent assigning the same resident if they are already actively assigned
        $alreadyAssigned = $house->residents()
            ->where('resident_id', $residentId)
            ->wherePivotNull('moved_out_at')
            ->exists();

        if ($alreadyAssigned) {
            return response()->json(['message' => 'Resident is already assigned to this house'], 400);
        }

        $house->residents()->attach($residentId, [
            'is_pic' => $request->boolean('is_pic'),
            'moved_in_at' => now(),
        ]);

        if ($house->status === 'tidak_dihuni') {
            $house->update(['status' => 'dihuni']);
        }

        return response()->json(['message' => 'Resident assigned successfully'], 201);
    }

    public function destroy(House $house, Resident $resident)
    {
        $pivot = $house->residents()
            ->where('resident_id', $resident->id)
            ->wherePivotNull('moved_out_at')
            ->first();

        if (!$pivot) {
            return response()->json(['message' => 'Active assignment not found'], 404);
        }

        $house->residents()->updateExistingPivot($resident->id, [
            'moved_out_at' => now(),
        ]);

        // If no active residents left, update house status
        $activeResidentsCount = $house->residents()->wherePivotNull('moved_out_at')->count();
        
        if ($activeResidentsCount === 0) {
            $house->update(['status' => 'tidak_dihuni']);
        }

        return response()->json(['message' => 'Resident unassigned successfully']);
    }
}

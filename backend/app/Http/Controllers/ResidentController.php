<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resident;
use App\Http\Resources\ResidentResource;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResidentController extends Controller
{
    public function index()
    {
        return ResidentResource::collection(Resident::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'status' => 'required|in:tetap,kontrak',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'boolean',
            'ktp_photo' => 'nullable|image|max:5120', // max 5MB
        ]);

        $path = null;
        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp', 'local');
        }

        $resident = Resident::create([
            'full_name' => $validated['full_name'],
            'status' => $validated['status'],
            'phone_number' => $validated['phone_number'],
            'is_married' => $request->boolean('is_married'),
            'ktp_photo_path' => $path,
        ]);

        return new ResidentResource($resident);
    }

    public function show(Resident $resident)
    {
        return new ResidentResource($resident->load('houses'));
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'full_name' => 'string|max:255',
            'status' => 'in:tetap,kontrak',
            'phone_number' => 'string|max:20',
            'is_married' => 'boolean',
            'ktp_photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('ktp_photo')) {
            if ($resident->ktp_photo_path) {
                Storage::disk('local')->delete($resident->ktp_photo_path);
            }
            $resident->ktp_photo_path = $request->file('ktp_photo')->store('ktp', 'local');
        }

        $resident->update($request->except('ktp_photo'));

        return new ResidentResource($resident);
    }

    public function destroy(Resident $resident)
    {
        // "Penghuni yang sudah di-assign ke rumah tidak bisa dihapus, hanya di-unassign"
        if ($resident->houses()->wherePivotNull('moved_out_at')->exists()) {
            return response()->json(['message' => 'Cannot delete a resident assigned to a house'], 400);
        }

        if ($resident->ktp_photo_path) {
            Storage::disk('local')->delete($resident->ktp_photo_path);
        }
        
        $resident->delete();
        return response()->noContent();
    }

    public function showKtp(Resident $resident)
    {
        if (!$resident->ktp_photo_path || !Storage::disk('local')->exists($resident->ktp_photo_path)) {
            abort(404, 'KTP not found');
        }

        return Storage::disk('local')->response($resident->ktp_photo_path);
    }
}

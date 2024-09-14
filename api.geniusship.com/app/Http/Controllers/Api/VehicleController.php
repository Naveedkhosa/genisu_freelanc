<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index()
    {
        return response()->json(Vehicle::with('driver')->get(), 200);
    }

    public function show($id)
    {
        $vehicle = Vehicle::find($id);
        if ($vehicle) {
            return response()->json($vehicle, 200);
        } else {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_number' => 'required|string|max:50|unique:vehicles',
            'model' => 'required|string|max:255',
            'owner' => 'required|string|max:255',
            'year' => 'required|integer',
            'status' => 'required|string|in:Available,In Maintenance,Assigned',
            'driver_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $vehicle = Vehicle::create($request->all());
        return response()->json($vehicle, 201);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);
        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_number' => 'string|max:50|unique:vehicles,vehicle_number,' . $id,
            'model' => 'string|max:255',
            'owner' => 'string|max:255',
            'year' => 'integer',
            'status' => 'string|in:Available,In Maintenance,Assigned',
            'driver_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $vehicle->update($request->all());
        return response()->json($vehicle, 200);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);
        if ($vehicle) {
            $vehicle->delete();
            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }
    }

    public function listAllVehicles()
    {
        $vehicles = Vehicle::all();
        return response()->json($vehicles, 200);
    }
}

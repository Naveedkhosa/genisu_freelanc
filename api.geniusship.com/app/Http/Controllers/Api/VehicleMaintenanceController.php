<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleMaintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleMaintenanceController extends Controller
{
    public function index()
    {
        return response()->json(VehicleMaintenance::all(), 200);
    }

    public function show($id)
    {
        $maintenance = VehicleMaintenance::find($id);
        if ($maintenance) {
            return response()->json($maintenance, 200);
        } else {
            return response()->json(['message' => 'Maintenance record not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'maintenance_date' => 'required|date',
            'details' => 'required|string',
            'cost' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $maintenance = VehicleMaintenance::create($request->all());
        return response()->json($maintenance, 201);
    }

    public function update(Request $request, $id)
    {
        $maintenance = VehicleMaintenance::find($id);
        if (!$maintenance) {
            return response()->json(['message' => 'Maintenance record not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'exists:vehicles,id',
            'maintenance_date' => 'date',
            'details' => 'string',
            'cost' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $maintenance->update($request->all());
        return response()->json($maintenance, 200);
    }

    public function destroy($id)
    {
        $maintenance = VehicleMaintenance::find($id);
        if ($maintenance) {
            $maintenance->delete();
            return response()->json(['message' => 'Maintenance record deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Maintenance record not found'], 404);
        }
    }
}

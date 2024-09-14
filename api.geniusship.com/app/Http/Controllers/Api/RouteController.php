<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\RouteAssignment;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RouteController extends Controller
{
    // Route CRUD operations

    public function index()
    {
        return response()->json(Route::with('routeAssignments')->get(), 200);
    }

    public function show($id)
    {
        $route = Route::with('routeAssignments')->find($id);
        if ($route) {
            return response()->json($route, 200);
        } else {
            return response()->json(['message' => 'Route not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'string|nullable',
            'start_location' => 'required|string|max:255',
            'end_location' => 'required|string|max:255',
            'distance_km' => 'required|numeric',
            'estimated_time_minutes' => 'required|integer',
            'cost' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $route = Route::create($request->all());
        return response()->json($route, 201);
    }

    public function update(Request $request, $id)
    {
        $route = Route::find($id);
        if (!$route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string|nullable',
            'start_location' => 'string|max:255',
            'end_location' => 'string|max:255',
            'distance_km' => 'numeric',
            'estimated_time_minutes' => 'integer',
            'cost' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $route->update($request->all());
        return response()->json($route, 200);
    }

    public function destroy($id)
    {
        $route = Route::find($id);
        if ($route) {
            $route->delete();
            return response()->json(['message' => 'Route deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Route not found'], 404);
        }
    }

    // RouteAssignment update operation

    public function updateRouteAssignment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'route_id' => 'required|exists:routes,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $routeAssignment = RouteAssignment::where('route_id', $request->route_id)
            ->where('vehicle_id', $request->vehicle_id)
            ->where('driver_id', $id)
            ->first();

        if ($routeAssignment) {
            $routeAssignment->update($request->all());
        } else {
            $routeAssignment = RouteAssignment::create($request->all());
        }

        return response()->json($routeAssignment, 200);
    }

    // Select driver based on vehicle ID

    public function selectDriverByVehicleId($vehicle_id)
    {
        $vehicle = Vehicle::find($vehicle_id);
        if ($vehicle) {
            return response()->json($vehicle->driver, 200);
        } else {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }
    }
}

<?php

/* namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TruckType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class TruckTypeController extends Controller
{
     // api crud for truck type
    // methods: index, store, show, update, destroy
    public function index(){
        $truckTypes = TruckType::all();
        return response()->json($truckTypes);
    }

    public function show($id){
        $truckType = TruckType::find($id);
        if ($truckType) {
            return response()->json($truckType, 200);
        } else {
            return response()->json(['message' => 'Truck type not found'], 404);
        }
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $truckType = TruckType::create($request->all());
        return response()->json($truckType, 201);
    }

    public function update(Request $request, $id){
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['message' => 'Truck type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string|nullable|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $truckType->update($request->all());
        return response()->json($truckType, 200);
    }

    public function destroy($id){
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['message' => 'Truck type not found'], 404);
        }

        $truckType->delete();
        return response()->json(['message' => 'Truck type deleted successfully'], 200);
    }

}
 */


 namespace App\Http\Controllers\Api;

use App\Models\TruckType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TruckTypeController extends Controller
{
    // List all truck types
    public function index()
    {
        $truckTypes = TruckType::all();
        return response()->json($truckTypes, 200);
    }

    // Show a single truck type by ID
    public function show($id)
    {
        $truckType = TruckType::find($id);

        if (!$truckType) {
            return response()->json(['message' => 'Truck Type not found'], 404);
        }

        return response()->json($truckType, 200);
    }

    // Create a new truck type
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required',
        ]);

        $truckType = TruckType::create($request->all());

        return response()->json($truckType, 201);
    }

    // Update an existing truck type
    public function update(Request $request, $id)
    {
        $truckType = TruckType::find($id);

        if (!$truckType) {
            return response()->json(['message' => 'Truck Type not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $truckType->update($request->all());

        return response()->json($truckType, 200);
    }

    // Delete a truck type
    public function destroy($id)
    {
        $truckType = TruckType::find($id);

        if (!$truckType) {
            return response()->json(['message' => 'Truck Type not found'], 404);
        }

        $truckType->delete();

        return response()->json(['message' => 'Truck Type deleted successfully'], 200);
    }
}

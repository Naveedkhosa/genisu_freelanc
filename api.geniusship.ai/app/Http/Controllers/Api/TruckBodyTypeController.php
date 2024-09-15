<?php

/* namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TruckBodyType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TruckBodyTypeController extends Controller
{
    // api crud for truck body type
    // methods: index, store, show, update, destroy

    public function index(){
        $bodyTypes = TruckBodyType::all();
        return response()->json($bodyTypes);
    }

    public function show($id){
        $bodyType = TruckBodyType::find($id);
        if ($bodyType) {
            return response()->json($bodyType, 200);
        } else {
            return response()->json(['message' => 'Truck body type not found'], 404);
        }
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $bodyType = TruckBodyType::create($request->all());
        return response()->json($bodyType, 201);
    }

    public function update(Request $request, $id){
        $bodyType = TruckBodyType::find($id);
        if (!$bodyType) {
            return response()->json(['message' => 'Truck body type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $bodyType->update($request->all());
        return response()->json($bodyType, 200);
    }

    public function destroy($id){
        $bodyType = TruckBodyType::find($id);
        if ($bodyType) {
            $bodyType->delete();
            return response()->json(['message' => 'Truck body type deleted'], 204);
        } else {
            return response()->json(['message' => 'Truck body type not found'], 404);
        }
    }

}
 */

 namespace App\Http\Controllers\Api;

use App\Models\TruckBodyType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TruckBodyTypeController extends Controller
{
    // List all truck body types
    public function index()
    {
        $truckBodyTypes = TruckBodyType::all();
        return response()->json($truckBodyTypes, 200);
    }

    // Show a single truck body type by ID
    public function show($id)
    {
        $truckBodyType = TruckBodyType::find($id);

        if (!$truckBodyType) {
            return response()->json(['message' => 'Truck Body Type not found'], 404);
        }

        return response()->json($truckBodyType, 200);
    }

    // Create a new truck body type
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $truckBodyType = TruckBodyType::create($request->all());

        return response()->json($truckBodyType, 201);
    }

    // Update an existing truck body type
    public function update(Request $request, $id)
    {
        $truckBodyType = TruckBodyType::find($id);

        if (!$truckBodyType) {
            return response()->json(['message' => 'Truck Body Type not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $truckBodyType->update($request->all());

        return response()->json($truckBodyType, 200);
    }

    // Delete a truck body type
    public function destroy($id)
    {
        $truckBodyType = TruckBodyType::find($id);

        if (!$truckBodyType) {
            return response()->json(['message' => 'Truck Body Type not found'], 404);
        }

        $truckBodyType->delete();

        return response()->json(['message' => 'Truck Body Type deleted successfully'], 200);
    }
}

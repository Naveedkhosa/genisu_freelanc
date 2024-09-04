<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackageType;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class PackagesTypeController extends Controller
{
    
    //  get all packages
    public function index(){
        $packageTypes = PackageType::all();
        return response()->json($packageTypes);
    }

    // show single package
    public function show($id){
        $packageType = PackageType::find($id);
        if ($packageType) {
            return response()->json($packageType, 200);
        } else {
            return response()->json(['message' => 'Package type not found'], 404);
        }
    }

    // create new package type
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $packageType = new PackageType();
        $packageType->name = $request->name;

        $packageType->save();

        return response()->json($packageType, 201);
    }

    // update package type
    public function update(Request $request, $id){
        $packageType = PackageType::find($id);
        if (!$packageType) {
            return response()->json(['message' => 'Package type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $packageType->name = $request->name;
        $packageType->save();

        return response()->json($packageType, 200);
    }

    // delete package
    public function destroy($id){
        $packageType = PackageType::find($id);
        if (!$packageType) {
            return response()->json(['message' => 'Package type not found'], 404);
        }

        $packageType->delete();
        return response()->json(null, 204);
    }


}

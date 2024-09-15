<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PackageType;

class PackageTypeController extends Controller
{
    // List all package types
    public function index()
    {
        $packageTypes = PackageType::all();
        return response()->json($packageTypes, 200);
    }

    // Show a single package type by ID
    public function show($id)
    {
        $packageType = PackageType::find($id);

        if (!$packageType) {
            return response()->json(['message' => 'Package Type not found'], 404);
        }

        return response()->json($packageType, 200);
    }

    // Create a new package type
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $packageType = PackageType::create($request->all());

        return response()->json($packageType, 201);
    }

    // Update an existing package type
    public function update(Request $request, $id)
    {
        $packageType = PackageType::find($id);

        if (!$packageType) {
            return response()->json(['message' => 'Package Type not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $packageType->update($request->all());

        return response()->json($packageType, 200);
    }

    // Delete a package type
    public function destroy($id)
    {
        $packageType = PackageType::find($id);

        if (!$packageType) {
            return response()->json(['message' => 'Package Type not found'], 404);
        }

        $packageType->delete();

        return response()->json(['message' => 'Package Type deleted successfully'], 200);
    }
}

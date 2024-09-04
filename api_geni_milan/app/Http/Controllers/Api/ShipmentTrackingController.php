<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShipmentTracking;

class ShipmentTrackingController extends Controller
{
    public function index()
    {
        return ShipmentTracking::all();
    }

    public function show($id)
    {
        return ShipmentTracking::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'location' => 'required|string|max:255',
            'status' => 'required|in:pickup,in_transit,delivered'
        ]);

        $tracking = ShipmentTracking::create($request->all());

        return response()->json($tracking, 201);
    }

    public function TrackingHistory($id)
    {
        $trackings = ShipmentTracking::where('shipment_id','=',$id)->get();
        return response()->json($trackings, 201);
    }

    public function destroy($id)
    {
        $tracking = ShipmentTracking::findOrFail($id);
        $tracking->delete();

        return response()->json("Deleted Successfully", 204);
    }
}

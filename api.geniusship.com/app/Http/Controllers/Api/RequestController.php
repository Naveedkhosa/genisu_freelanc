<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Request;
use App\Models\Shipment;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    public function store(HttpRequest $request)
    {
       
    }

    public function index()
    {
        $requests = Shipment::with('customer')
            ->with('shipmentPackages')
            ->with('bids')
            ->whereDoesntHave('bids')
            ->orWhereHas('bids', function ($query) {
                $query->where('bidder_id', '!=', Auth::id());
            })->latest()
            ->get();

        return response()->json($requests);
    }

    public function show($id)
    {
        
        $request = Shipment::with(['customer','shipmentPackages','bids','my_bid'])->findOrFail($id);
        
        return response()->json($request);
    }

    public function customer_index($id)
    {
        $requests = Request::with('user')
            ->where('customer_id', '=', $id)
            ->where(function ($query) {
                $query->whereDoesntHave('bids')
                    ->orWhereHas('bids', function ($subQuery) {
                        $subQuery->where('bid_status', '!=', 'Accepted');
                    });
            })
            ->latest()
            ->get();

        return response()->json($requests);
    }

    public function destroy($id)
    {
        $request = Request::findOrFail($id);

        if ($request->customer_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->delete();

        return response()->json(['message' => 'Request deleted successfully'], 200);
    }

    public function getAllBidsForRequest($id)
    {
        $all_bids = Bid::with(['request', 'transporter', 'driver'])->where('request_id', '=', $id)->get();
        return response()->json($all_bids);
    }

    public function acceptCurrentOffer($request_id, $id)
    {
        $bidToAccept = Bid::where('id', '=', $id)
            ->where('request_id', '=', $request_id)
            ->first();
        if (!$bidToAccept) {
            return response()->json(['error' => 'Bid not found'], 404);
        }
        $bidToAccept->update(['bid_status' => 'Accepted']);
        Bid::where('request_id', '=', $request_id)
            ->where('id', '!=', $id)
            ->update(['bid_status' => 'Rejected']);
        return response()->json($bidToAccept, 200);
    }

    public function rejectCurrentOffer($request_id, $id)
    {
        $bidToReject = Bid::where('id', '=', $id)
            ->where('request_id', '=', $request_id)
            ->first();
        if (!$bidToReject) {
            return response()->json(['error' => 'Bid not found'], 404);
        }
        $bidToReject->update(['bid_status' => 'Rejected']);
        return response()->json($bidToReject, 200);
    }

    public function getAllShipments($user_id)
    {

        $all_requests = Bid::where('bidder', '=', $user_id)->where('bid_status', '=', 'accepted')->with(['bidder', 'request', 'request.user'])->get();
        return response()->json($all_requests);
    }
}

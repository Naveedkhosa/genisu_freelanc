<?php

namespace App\Http\Controllers\Api;

use App\Events\UserNotification;
use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    public function index()
    {
        return Bid::all();
    }

    public function show($id)
    {
        return Bid::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipment_id' => 'required',
            'bid_amount' => 'required|numeric',
        ]);

        $shipment = Shipment::where('status', '=', 'pending')->where('id', '=', $request->shipment_id)->firstOrFail();

        if ($shipment) {
            $user = Auth::user();

            if ($user->role == 'Driver' || $user->role == 'Transporter') {
                $bid = Bid::create([
                    'shipment_id' => $request->shipment_id,
                    'bid_amount' => $request->bid_amount,
                    'bidder_id' => $user->id,
                    'bid_status' => 'Pending',
                ]);
                $message = "New bid received on your shipment with tracking number #$shipment->tracking_number";
                $notification = [
                    'concernee' => $shipment->customer_id,
                    'title' => 'New Bid Received',
                    'shiping_id' => $shipment->id,
                    'message' => $message,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                event(new UserNotification($notification));
                return response()->json(["success"=>true,"message"=>"Bid offer sent successfully"], 201);
            } else {
                return response()->json("Only drivers and transporters can bid on shipments", 403);
            }
        } else {
            return response()->json("Shipment not found", 404);
        }
    }

    public function rejectOffer($id)
    {
        $bid = Bid::where('id', '=', $id)->get();
        if (!$bid) {
            return response()->json(['error' => 'Bid not found'], 404);
        }
        Bid::where('id', '=', $id)->update(['bid_status' => 'Rejected']);
        return response()->json($bid, 200);
    }
    public function acceptOffer($id)
    {
        $bid = Bid::where('id', '=', $id)->first();
        if (!$bid) {
            return response()->json(['error' => 'Bid not found'], 404);
        }
        // begin transaction
        DB::transaction(function () use ($bid,$id) {
            Shipment::where('id', '=', $bid->shipment_id)->update(['status' => 'pickup']);
            Bid::where('id', '=', $id)->update(['bid_status' => 'Accepted']);
        });

        
        return response()->json($bid, 200);
    }

    public function update(Request $request, $id)
    {
        $bid = Bid::findOrFail($id);

        $request->validate([
            'bidder' => 'sometimes|exists:users,id',
            'bid_amount' => 'sometimes|numeric',
            'bid_status' => 'sometimes|in:Pending,Accepted,Rejected',
        ]);

        $bid->update($request->all());

        return response()->json($bid, 200);
    }

    public function destroy($id)
    {
        $bid = Bid::findOrFail($id);
        $bid->delete();

        return response()->json("Deleted Successfully", 204);
    }

}

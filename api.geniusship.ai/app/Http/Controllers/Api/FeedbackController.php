<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index()
    {
        return Feedback::with('user')->get();
    }

    public function show($id)
    {
        return Feedback::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'rating' => 'required|integer|between:1,5',
            'comments' => 'nullable|string',
        ]);

        $shipment = Shipment::with(['accepted_bid', 'reviews'])->where('id', '=', $request->shipment_id)->where('customer_id', '=', Auth::user()->id)->first();

        if (!isset($shipment->id)) {
            return response()->json([
                'status' => false,
                "can_review" => false,
                "shipment" => $shipment,
                "message" => "Shipment was not found in delivered shipments!",
            ]);
        }
        $feedback = Feedback::create($request->all());
        return response()->json([
            'status' => true,
            "feedback" => $feedback,
            "message" => "You have successfully left the feedback",
        ]);
    }

    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'rating' => 'sometimes|integer|between:1,5',
            'comments' => 'sometimes|string',
        ]);

        $feedback->update($request->all());

        return response()->json($feedback, 200);
    }

    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json("Deleted Successfully", 204);
    }
}

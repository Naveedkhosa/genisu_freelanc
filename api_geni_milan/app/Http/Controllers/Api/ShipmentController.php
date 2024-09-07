<?php
namespace App\Http\Controllers\Api;

use App\Events\DriverNotification;
use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentPackage;
use App\Models\ShipmentTracking;
use App\Models\TruckBodyType;
use App\Models\TruckType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ShipmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role == 'Admin') {
            $shipments = Shipment::with(['shipmentPackages', 'customer'])->withCount('bids')->get();
            return response()->json($shipments);
        }
        if ($user->role == "Driver" || $user->role == "Transporter") {
            $shipments = Shipment::with(['shipmentPackages', 'customer', 'chat_room', 'my_bid' => function ($query) use ($user) {
                $query->where('bidder_id', $user->id);
            }])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($shipments);
        }
        $shipments = Shipment::with('shipmentPackages')->with('customer')->with('chat_room')->withCount('bids')->where("customer_id", "=", Auth::id())->orderBy('created_at', 'desc')->get();

        return response()->json($shipments);
    }

    public function Review($id)
    {
        $shipment = Shipment::with(['accepted_bid', 'reviews'])->where('id', '=', $id)->where('customer_id', '=', Auth::user()->id)->first();

        if (isset($shipment->id)) {
            if (isset($shipment->reviews) && count($shipment->reviews) > 0) {
                return response()->json([
                    'status' => true,
                    "can_review" => false,
                    "shipment" => $shipment,
                    "message" => 'You have already left a review',
                ]);
            }

            return response()->json([
                'status' => true,
                "can_review" => true,
                "shipment" => $shipment,
                "message" => 'You can left a review',
            ]);
        } else {
            return response()->json([
                'status' => false,
                "can_review" => false,
                "shipment" => $shipment,
                "message" => "Shipment was not found in delivered shipments!",
            ]);
        }

    }

    public function trackShipment($tracking_id)
    {
        $shipment = Shipment::with('winningBid')->where("tracking_number", "=", $tracking_id)->get();
        return response()->json($shipment);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pickup_address' => 'required|string',
            'destination_address' => 'required|string',
            'pickup_date' => 'required',
            'destination_date' => 'required',
            'pickup_time' => 'required',
            'pickup_coordinates' => 'required|string',
            'destination_coordinates' => 'required|string',
            'expected_price' => 'required|numeric',
            'pickup_contact' => 'required|string',
            'pickup_name' => 'required|string',
            'drop_contact' => 'required|string',
            'drop_name' => 'required|string',
            'total_weight' => "required|numeric",
            'type_of_goods' => "required|string",
            "length_of_goods" => 'required|numeric',
            "truck_type" => "required",
            "truck_body_type" => "required",
            'shipment_packages' => 'required|array',
            'shipment_packages.*.quantity' => 'required|numeric',
            'shipment_packages.*.type_of_package' => 'required|exists:packages_types,id',
            'shipment_packages.*.length' => 'required|numeric',
            'shipment_packages.*.wide' => 'required|numeric',
            'shipment_packages.*.height' => 'required|numeric',
            'shipment_packages.*.unit_weight' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::transaction(function () use ($request) {

            $truck_type = TruckType::where("id", "=", $request->truck_type)->first()->name;
            $truck_body_type = TruckBodyType::where("id", "=", $request->truck_body_type)->first()->name;

            $shipment = Shipment::create([
                'tracking_number' => "",
                'pickup_address' => $request->pickup_address,
                'destination_address' => $request->destination_address,
                'pickup_date' => $request->pickup_date,
                'destination_date' => $request->destination_date,
                'pickup_time' => $request->pickup_time,
                'pickup_address_coords' => $request->pickup_coordinates,
                'destination_address_coords' => $request->destination_coordinates,
                'expected_price' => $request->expected_price,
                'pickup_contact_phone' => $request->pickup_contact,
                'pickup_contact_name' => $request->pickup_name,
                'drop_contact_phone' => $request->drop_contact,
                'drop_contact_name' => $request->drop_name,
                'total_weight' => $request->total_weight,
                'type_of_goods' => $request->type_of_goods,
                "length" => $request->length_of_goods,
                "customer_id" => Auth::user()->id,
                "truck_body_type" => $truck_body_type,
                "truck_type" => $truck_type,
                "notes" => $request->notes ?? null,
            ]);

            $tracking_number = "MGS" . Auth::user()->id . rand(100, 999) . $shipment->id;

            foreach ($request->shipment_packages as $package) {
                ShipmentPackage::create([
                    'shipment_id' => $shipment->id,
                    'quantity' => $package['quantity'],
                    'type_of_package' => $package['type_of_package'],
                    'length' => $package['length'],
                    'wide' => $package['wide'],
                    'height' => $package['height'],
                    'unit_weight' => $package['unit_weight'],
                ]);
            }

            $shipment->update(['tracking_number' => $tracking_number]);

            event(new DriverNotification("New shipment for pickup from $shipment->pickup_address to $shipment->destination_address", "shipment"));

        });

        return response()->json(['message' => 'Shipment created successfully'], 201);
    }

    public function show($id, $sortby = "asc")
    {
        $user = Auth::user();
        if ($user->role == 'Admin') {
            $shipment = Shipment::with(['shipmentPackages', 'customer', 'bids'])->withCount('bids')->where('id', '=', $id)->first();
            $bids = $shipment->bids()->orderBy('bid_amount', $sortby)->get();
            $shipment->setRelation('bids', $bids);
            return response()->json($shipment, 201);
        }
        $shipment = Shipment::with(['shipmentPackages', 'customer', 'bids'])->withCount('bids')->where("customer_id", "=", $user->id)->where('id', '=', $id)->first();
        $bids = $shipment->bids()->orderBy('bid_amount', $sortby)->get();

        $recomm = $shipment->bids()->orderBy('bid_amount', 'asc')->first();

        $recomm_id = 0;
        if ($recomm) {
            $recomm_id = $recomm->id;
        }

        $shipment->recomm_id = $recomm_id;

        $shipment->setRelation('bids', $bids);
        return response()->json($shipment, 201);
    }

    public function update(Request $request, $id)
    {
        $shipment = Shipment::find($id);

        if (is_null($shipment)) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'pickup_address' => 'sometimes|required|string',
            'destination_address' => 'sometimes|required|string',
            'pickup_date' => 'sometimes|required|date',
            'destination_date' => 'sometimes|required|date',
            'pickup_time' => 'sometimes|required|date_format:H:i:s',
            'pickup_coordinates' => 'sometimes|required|string',
            'destination_coordinates' => 'sometimes|required|string',
            'expected_price' => 'sometimes|required|numeric',
            'pickup_contact' => 'sometimes|required|string',
            'pickup_name' => 'sometimes|required|string',
            'drop_contact' => 'sometimes|required|string',
            'drop_name' => 'sometimes|required|string',
            'shipment_packages' => 'sometimes|required|array',
            'shipment_packages.*.quantity' => 'sometimes|required|numeric',
            'shipment_packages.*.type_of_package' => 'sometimes|required|exists:packages_types,id',
            'shipment_packages.*.length' => 'sometimes|required|numeric',
            'shipment_packages.*.wide' => 'sometimes|required|numeric',
            'shipment_packages.*.height' => 'sometimes|required|numeric',
            'shipment_packages.*.unit_weight' => 'sometimes|required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::transaction(function () use ($request, $shipment) {
            $shipment->update([
                'pickup_address' => $request->get('pickup_address', $shipment->pickup_address),
                'destination_address' => $request->get('destination_address', $shipment->destination_address),
                'pickup_date' => $request->get('pickup_date', $shipment->pickup_date),
                'destination_date' => $request->get('destination_date', $shipment->destination_date),
                'pickup_time' => $request->get('pickup_time', $shipment->pickup_time),
                'pickup_address_coords' => $request->get('pickup_coordinates', $shipment->pickup_address_coords),
                'destination_address_coords' => $request->get('destination_coordinates', $shipment->destination_address_coords),
                'expected_price' => $request->get('expected_price', $shipment->expected_price),
                'pickup_contact_phone' => $request->get('pickup_contact', $shipment->pickup_contact_phone),
                'pickup_contact_name' => $request->get('pickup_name', $shipment->pickup_contact_name),
                'drop_contact_phone' => $request->get('drop_contact', $shipment->drop_contact_phone),
                'drop_contact_name' => $request->get('drop_name', $shipment->drop_contact_name),
            ]);

            if ($request->has('shipment_packages')) {
                $shipment->shipmentPackages()->delete();

                foreach ($request->shipment_packages as $package) {
                    ShipmentPackage::create([
                        'shipment_id' => $shipment->id,
                        'quantity' => $package['quantity'],
                        'type_of_package' => $package['type_of_package'],
                        'length' => $package['length'],
                        'wide' => $package['wide'],
                        'height' => $package['height'],
                        'unit_weight' => $package['unit_weight'],
                    ]);
                }
            }
        });

        return response()->json($shipment);
    }

    public function destroy($id)
    {
        $shipment = Shipment::find($id);

        if (is_null($shipment)) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }

        $shipment->delete();
        return response()->json(null, 204);
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:shipments,id',
            'status' => 'required|in:pickup,in_transit,delivered',
        ]);
        $shipment = Shipment::find($request->id);
        if ($shipment) {

            $can = [];

            if ($shipment->status == "order_confirmed") {
                array_push($can, "pickup");
            } else if ($shipment->status == "pickup") {
                array_push($can, "in_transit");
            } else if ($shipment->status == "in_transit") {
                array_push($can, "delivered");
            }

            if (in_array($request->status, $can)) {
                $shipment->status = $request->status;
                $shipment->save();

                ShipmentTracking::create([
                    'shipment_id' => $request->id,
                    'timestamp' => now(),
                    'location' => $shipment->pickup_address,
                    'status' => $request->status,
                ]);
                return response()->json(['message' => 'Status updated successfully'], 200);
            } else {
                return response()->json(['message' => 'You can not update status'], 404);
            }
        }
        return response()->json(['message' => 'Shipment not found'], 404);
    }

}

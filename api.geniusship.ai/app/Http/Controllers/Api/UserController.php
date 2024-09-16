<?php

namespace App\Http\Controllers\Api;

use App\Events\Message;
use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('userDetail')->get();
        return response()->json($users, 200);
    }

    public function show($id)
    {
        $user = User::with('userDetail')->find($id);
        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function updateLocations(Request $request)
    {
        $resp = event(new Message($request->lat, $request->lng, $request->name, $request->id));
    }

    public function getMultiPickup()
    {
        $user = Auth::user()->id;
        $bids = Bid::where('bidder_id', $user)
            ->where('bid_status', 'Accepted')
            ->with(['bidder', 'shipment' => function ($query) {
                $query->whereNotIn('status', ['pending', 'delivered'])
                    ->where(function ($q) {
                        $q->where('status', 'order_confirmed')
                            ->orWhere('status', 'pickup');
                    });
            }])
            ->get();

        return response()->json([
            "success" => true,
            "bids" => $bids,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:Admin,Customer,Driver,Transporter',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            $userDetailsData = $request->only([
                'transporter_id', 'phone', 'address', 'company', 'license_number',
            ]);
            $userDetailsData['user_id'] = $user->id;
            UserDetail::create($userDetailsData);

            DB::commit();

            return response()->json($user->load('userDetail'), 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Return a more specific error message if needed
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::with('userDetail')->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validation rules for the request
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255',
            'phone' => 'string|max:15',
            'currentPassword' => 'nullable|string|min:6',
            // Note: Removed 'newPassword' and 'repeatPassword' from validation
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Check current password if provided
        if ($request->filled('currentPassword')) {
            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json(['currentPassword' => ['Current password is incorrect']], 400);
            }
            // Update password only if newPassword is present
            if ($request->filled('newPassword')) {
                $user->password = Hash::make($request->newPassword);
            }
        }

        // Update user and user details
        $user->update($request->only(['name', 'email']));

        $userDetailsData = $request->only([
            'phone', 'address', 'company', 'license_number',
        ]);
        $userDetailsData['user_id'] = $user->id;

        if ($user->userDetail) {
            $user->userDetail()->update($userDetailsData);
        } else {
            $user->userDetail()->create($userDetailsData);
        }

        return response()->json($user->load('userDetail'), 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function getAllCustomers()
    {
        $customers = User::where('role', 'Customer')->with('userDetail')->get();
        return response()->json($customers, 200);
    }

    public function getAllTransporters()
    {
        $transporters = User::where('role', 'Transporter')->with('userDetail')->get();
        return response()->json($transporters, 200);
    }

    public function getAllDrivers()
    {
        $drivers = User::where('role', 'Driver')->with('userDetail')->get();
        return response()->json($drivers, 200);
    }

    public function getTransporterDrivers($transporter_id)
    {
        // Fetch drivers whose role is 'Driver' and whose userDetail's transporter_id matches the provided transporter_id
        $drivers = User::where('role', 'Driver')
            ->whereHas('userDetail', function ($query) use ($transporter_id) {
                $query->where('transporter_id', $transporter_id);
            })
            ->with('userDetail')
            ->get();

        // Return the result as JSON response
        return response()->json($drivers, 200);
    }
}

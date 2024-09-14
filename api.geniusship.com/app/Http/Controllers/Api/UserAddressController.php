<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserAddress;

class UserAddressController extends Controller
{
    public function getUserAddresses($id){
        $addresses = UserAddress::where("user_id","=",$id)->get();
        return response()->json($addresses, 200);
    }

    // deleteUserAddress 
    public function deleteUserAddress($id){
        $userAddress = UserAddress::where("user_id","=",Auth::user()->id)->where("id","=",$id)->first();
        if ($userAddress) {
            $userAddress->delete();
            return response()->json(['message' => 'User address deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'User address not found'], 404);
        }
    }
}

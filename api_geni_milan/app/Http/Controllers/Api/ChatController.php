<?php

namespace App\Http\Controllers\Api;

use App\Events\Chat;
use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $auth_user = Auth::user();
        if ($auth_user->role == "Customer") {
            $rooms = ChatRoom::with('messages')->where('customer_id', '=', $auth_user->id)->get();
        } else {
            $rooms = ChatRoom::with('messages')->where('bidder_id', '=', $auth_user->id)->get();
        }
        return response()->json([
            "success" => true,
            "rooms" => $rooms,
        ]);
    }

    public function messages($id)
    {
        $chat_room = ChatRoom::with('messages')->where('id', '=', $id)->first();

        if (!$chat_room) {
            return response()->json([
                "success" => false,
                "message" => "No chat was found with this id",
            ]);
        }
        return response()->json([
            "success" => true,
            "chat_room" => $chat_room,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            "message" => 'required|string',
        ]);

        $message = ChatMessage::create([
            'message' => $request->get('message'),
            'user_id' => Auth::user()->id,
            'chat_id' => $request->get('chat_id'),
            'file_name' => null,
        ]);

        event(new Chat($message));

        return response()->json([
            "success" => true,
            "message" => "Message sent successfully",
        ]);

    }
}

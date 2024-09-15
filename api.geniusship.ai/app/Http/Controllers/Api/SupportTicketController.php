<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;

class SupportTicketController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if($user->role === 'Admin'){
            return SupportTicket::with('user')->orderBy('updated_at', 'desc')->get();
        }
        return SupportTicket::with('user')->where('user_id',$user->id)->orderBy('updated_at', 'desc')->get();
    }

    public function show($id)
    {
        return SupportTicket::with(['user', 'messages'])->findOrFail($id);
    }

    public function storeMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $supportTicket = SupportTicket::findOrFail($id);

        $message = new SupportTicketMessage();
        $message->ticket_id = $supportTicket->id;
        $message->user_id = Auth::id(); // Assuming the user is authenticated
        $message->message = $request->message;
        $message->save();

        return response()->json($message, 201);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $supportTicket = SupportTicket::create($request->all());

        return response()->json($supportTicket, 201);
    }

    public function update(Request $request, $id)
    {
        $supportTicket = SupportTicket::findOrFail($id);

        $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:Open,In Progress,Resolved,Closed',
        ]);

        $supportTicket->update($request->all());

        return response()->json($supportTicket, 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $supportTicket = SupportTicket::findOrFail($id);

        $request->validate([
            'status' => 'required|in:open,resolved,closed',
        ]);

        $supportTicket->update(['status' => $request->status]);

        return response()->json($supportTicket, 200);
    }

    public function destroy($id)
    {
        $supportTicket = SupportTicket::findOrFail($id);
        $supportTicket->delete();

        return response()->json("Deleted Successfully", 204);
    }
}

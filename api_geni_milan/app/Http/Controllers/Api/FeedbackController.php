<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;

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
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|between:1,5',
            'comments' => 'nullable|string',
        ]);

        $feedback = Feedback::create($request->all());

        return response()->json($feedback, 201);
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

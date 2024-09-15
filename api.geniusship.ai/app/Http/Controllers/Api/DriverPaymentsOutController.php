<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DriverPaymentsOut;

class DriverPaymentsOutController extends Controller
{
    public function index()
    {
        return response()->json(DriverPaymentsOut::all(), 200);
    }

    public function show($id)
    {
        $payment = DriverPaymentsOut::findOrFail($id);
        return response()->json($payment, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
            'transaction' => 'nullable|string|max:100',
        ]);

        $payment = DriverPaymentsOut::create($request->all());
        return response()->json($payment, 201);
    }

    public function update(Request $request, $id)
    {
        $payment = DriverPaymentsOut::findOrFail($id);

        $request->validate([
            'driver_id' => 'sometimes|exists:users,id',
            'amount' => 'sometimes|numeric',
            'payment_method' => 'sometimes|string|max:50',
            'transaction' => 'sometimes|string|max:100',
        ]);

        $payment->update($request->all());
        return response()->json($payment, 200);
    }

    public function destroy($id)
    {
        $payment = DriverPaymentsOut::findOrFail($id);
        $payment->delete();
        return response()->json(null, 204);
    }

    // Additional method to update payment_date and transaction
    public function updatePaymentDateAndTransaction(Request $request, $id)
    {
        $payment = DriverPaymentsOut::findOrFail($id);

        $request->validate([
            'payment_date' => 'required|date',
            'transaction' => 'required|string|max:100',
        ]);

        $payment->update($request->only('payment_date', 'transaction'));
        return response()->json($payment, 200);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DriverPaymentsIn;

class DriverPaymentsInController extends Controller
{
    public function index()
    {
        return response()->json(DriverPaymentsIn::all(), 200);
    }

    public function show($id)
    {
        $payment = DriverPaymentsIn::findOrFail($id);
        return response()->json($payment, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
            'shipment_id' => 'required|exists:shipments,id',
            'invoice_payment_id' => 'required|exists:invoice_payments,id',
            'amount' => 'required|numeric',
        ]);

        $payment = DriverPaymentsIn::create($request->all());
        return response()->json($payment, 201);
    }

    public function update(Request $request, $id)
    {
        $payment = DriverPaymentsIn::findOrFail($id);

        $request->validate([
            'driver_id' => 'sometimes|exists:users,id',
            'shipment_id' => 'sometimes|exists:shipments,id',
            'invoice_payment_id' => 'sometimes|exists:invoice_payments,id',
            'amount' => 'sometimes|numeric',
        ]);

        $payment->update($request->all());
        return response()->json($payment, 200);
    }

    public function destroy($id)
    {
        $payment = DriverPaymentsIn::findOrFail($id);
        $payment->delete();
        return response()->json(null, 204);
    }
}

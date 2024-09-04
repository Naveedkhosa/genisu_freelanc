<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminPaymentsIn;
use Illuminate\Http\Request;

class AdminPaymentsInController extends Controller
{
    public function index()
    {
        return AdminPaymentsIn::all();
    }

    public function show($id)
    {
        return AdminPaymentsIn::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:users,id',
            'shipment_id' => 'nullable|exists:shipments,id',
            'invoice_payment_id' => 'nullable|exists:invoice_payments,id',
            'amount' => 'required|numeric',
        ]);

        return AdminPaymentsIn::create($validated);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:users,id',
            'shipment_id' => 'nullable|exists:shipments,id',
            'invoice_payment_id' => 'nullable|exists:invoice_payments,id',
            'amount' => 'required|numeric',
        ]);

        $payment = AdminPaymentsIn::findOrFail($id);
        $payment->update($validated);

        return $payment;
    }

    public function destroy($id)
    {
        $payment = AdminPaymentsIn::findOrFail($id);
        $payment->delete();

        return response()->noContent();
    }
}

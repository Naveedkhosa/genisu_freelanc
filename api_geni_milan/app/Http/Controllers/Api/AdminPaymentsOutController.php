<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminPaymentsOut;
use Illuminate\Http\Request;

class AdminPaymentsOutController extends Controller
{
    public function index()
    {
        return AdminPaymentsOut::all();
    }

    public function show($id)
    {
        return AdminPaymentsOut::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
            'transaction' => 'nullable|string|max:100',
        ]);

        return AdminPaymentsOut::create($validated);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
            'transaction' => 'nullable|string|max:100',
        ]);

        $payment = AdminPaymentsOut::findOrFail($id);
        $payment->update($validated);

        return $payment;
    }

    public function destroy($id)
    {
        $payment = AdminPaymentsOut::findOrFail($id);
        $payment->delete();

        return response()->noContent();
    }

    public function updatePaymentDateAndTransaction(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_date' => 'required|date',
            'transaction' => 'required|string|max:100',
        ]);

        $payment = AdminPaymentsOut::findOrFail($id);
        $payment->update($validated);

        return $payment;
    }
}

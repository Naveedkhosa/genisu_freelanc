<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InvoicePayment;

class InvoicePaymentController extends Controller
{
    public function index()
    {
        return response()->json(InvoicePayment::all(), 200);
    }

    public function show($id)
    {
        $invoicePayment = InvoicePayment::findOrFail($id);
        return response()->json($invoicePayment, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'customer_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
            'transaction' => 'nullable|string|max:100',
        ]);

        $invoicePayment = InvoicePayment::create($request->all());
        return response()->json($invoicePayment, 201);
    }

    public function update(Request $request, $id)
    {
        $invoicePayment = InvoicePayment::findOrFail($id);

        $request->validate([
            'invoice_id' => 'sometimes|exists:invoices,id',
            'customer_id' => 'sometimes|exists:users,id',
            'amount' => 'sometimes|numeric',
            'payment_method' => 'sometimes|string|max:50',
            'transaction' => 'sometimes|string|max:100',
        ]);

        $invoicePayment->update($request->all());
        return response()->json($invoicePayment, 200);
    }

    public function destroy($id)
    {
        $invoicePayment = InvoicePayment::findOrFail($id);
        $invoicePayment->delete();
        return response()->json(null, 204);
    }

    // Additional method to update transaction and payment_date
    public function updateTransactionAndPaymentDate(Request $request, $id)
    {
        $invoicePayment = InvoicePayment::findOrFail($id);

        $request->validate([
            'transaction' => 'required|string|max:100',
            'payment_date' => 'required|date',
        ]);

        $invoicePayment->update($request->only('transaction', 'payment_date'));
        return response()->json($invoicePayment, 200);
    }
}

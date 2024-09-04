<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        return response()->json(Invoice::all(), 200);
    }

    public function show($id)
    {
        $invoice = Invoice::findOrFail($id);
        return response()->json($invoice, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'bid_id' => 'required|exists:bids,id',
            'customer_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'status' => 'required|in:Pending,Paid,Cancelled',
            'due_date' => 'required|date',
        ]);

        $invoice = Invoice::create($request->all());
        return response()->json($invoice, 201);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $request->validate([
            'shipment_id' => 'sometimes|exists:shipments,id',
            'bid_id' => 'sometimes|exists:bids,id',
            'customer_id' => 'sometimes|exists:users,id',
            'amount' => 'sometimes|numeric',
            'status' => 'sometimes|in:Pending,Paid,Cancelled',
            'due_date' => 'sometimes|date',
        ]);

        $invoice->update($request->all());
        return response()->json($invoice, 200);
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(["message" => "Deleted Successfully"], 204);
    }

    // Additional method to update status only
    public function updateStatus(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Pending,Paid,Cancelled',
        ]);

        $invoice->update($request->only('status'));
        return response()->json($invoice, 200);
    }
}

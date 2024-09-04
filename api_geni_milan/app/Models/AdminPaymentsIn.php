<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminPaymentsIn extends Model
{
    use HasFactory;

    protected $table = "admin_payments_in";

    protected $fillable = [
        'admin_id',
        'shipment_id',
        'invoice_payment_id',
        'amount',
        'payment_date',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function shipment()
    {
        return $this->belongsTo(Shipment::class, 'shipment_id');
    }

    public function invoicePayment()
    {
        return $this->belongsTo(InvoicePayment::class, 'invoice_payment_id');
    }
}

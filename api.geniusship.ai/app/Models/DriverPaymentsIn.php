<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverPaymentsIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id', 'shipment_id', 'invoice_payment_id', 'amount', 'payment_date'
    ];

    protected $table = "driver_payments_in";

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
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

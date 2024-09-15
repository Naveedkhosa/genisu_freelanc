<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoicePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id', 'customer_id', 'amount', 'payment_date', 'payment_method', 'transaction'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function driverPaymentsIn()
    {
        return $this->hasMany(DriverPaymentsIn::class, 'invoice_payment_id');
    }

    public function adminPaymentsIn()
    {
        return $this->hasMany(AdminPaymentsIn::class, 'invoice_payment_id');
    }
}

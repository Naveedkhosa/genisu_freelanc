<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id', 'bid_id', 'customer_id', 'amount', 'status', 'due_date'
    ];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    public function bid()
    {
        return $this->belongsTo(Bid::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function payments()
    {
        return $this->hasMany(InvoicePayment::class);
    }
}

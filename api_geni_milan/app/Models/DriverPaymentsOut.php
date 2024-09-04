<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverPaymentsOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id', 'amount', 'payment_date', 'payment_method', 'transaction'
    ];

    protected $table = "driver_payments_out";

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}

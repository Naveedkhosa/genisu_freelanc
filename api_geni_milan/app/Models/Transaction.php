<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'payment_id',
        'bid_id',
        'payer_name',
        'payer_email',
        'transaction_fee',
        'tax',
        'amount',
        'currency',
        'payment_status',
        'payment_method',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreelancerPayment extends Model
{
    use HasFactory;
    protected $fillable = [
        'freelancer_id',
        'shipment_id',
        'amount',
        'payment_status',
    ];
}

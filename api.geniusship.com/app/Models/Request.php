<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'pickup_city',
        'pickup_address',
        'destination_city',
        'destination_address',
        'pickup_coordinates',
        'destination_coordinates',
        'fare',
        'description',
        'time',
        'date',
        'payment_status',
        'payment_url',
        'payment_method'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function acceptedBid()
    {
        return $this->hasOne(Bid::class)->with(['transporter','driver'])->where('bid_status', 'Accepted');
    }
}

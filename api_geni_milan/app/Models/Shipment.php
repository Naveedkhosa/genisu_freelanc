<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number', 'customer_id', 'pickup_address', 'destination_address', 'pickup_address_coords', 'destination_address_coords', 'pickup_time', 'pickup_date', 'destination_date', 'truck_type', 'truck_body_type', 'expected_price', 'pickup_contact_name', 'pickup_contact_phone', 'drop_contact_name', 'drop_contact_phone', 'total_weight', 'length', 'type_of_goods', 'status',
    ];
    public function shipmentPackages()
    {
        return $this->hasMany(ShipmentPackage::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function reviews(){
        return $this->hasMany(FeedBack::class);
    }
    
    public function accepted_bid()
    {
        return $this->hasMany(Bid::class)->with('bidder')->where('bid_status', '=', 'Accepted');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class)->with('bidder')->where('bidder_id', '!=', Auth::user()->id);
    }

    public function my_bid()
    {
        return $this->hasMany(Bid::class)->with('bidder')->where('bidder_id', '=', Auth::user()->id);
    }
    
    // Optionally, define a method to get the winning bid
    public function winningBid()
    {
        return $this->hasOne(Bid::class, 'shipment_id')->where('bid_status', 'Accepted');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function driverPaymentsIn()
    {
        return $this->hasMany(DriverPaymentsIn::class, 'shipment_id');
    }

    public function adminPaymentsIn()
    {
        return $this->hasMany(AdminPaymentsIn::class, 'shipment_id');
    }
}

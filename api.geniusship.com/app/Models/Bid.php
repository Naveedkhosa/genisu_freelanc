<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id', 'bidder_id', 'bid_amount', 'bid_status',
    ];



    public function bidder()
    {
        return $this->belongsTo(User::class);
    }

    public function shipment(){
        return $this->belongsTo(Shipment::class)->with(['customer','shipmentPackages']);
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M Y H:i:s');
    }
    public function getUpdatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M Y');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}

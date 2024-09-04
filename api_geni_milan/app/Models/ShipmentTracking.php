<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id', 'timestamp', 'location', 'status'
    ];

    protected $table = "shipment_tracking";

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}

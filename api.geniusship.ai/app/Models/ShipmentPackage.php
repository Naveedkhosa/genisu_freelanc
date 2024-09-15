<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentPackage extends Model
{
    use HasFactory;
    protected $table = 'shipment_packages';
    protected $fillable = ["shipment_id", "quantity", "type_of_package", "length", "wide", "height", "unit_weight"];
}

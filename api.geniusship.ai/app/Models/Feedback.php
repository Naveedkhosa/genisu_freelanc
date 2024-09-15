<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id', 'rating', 'comments',
    ];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    
}

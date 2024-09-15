<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminPaymentsOut extends Model
{
    use HasFactory;

    protected $table = "admin_payments_out";

    protected $fillable = [
        'admin_id',
        'amount',
        'payment_date',
        'payment_method',
        'transaction',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}

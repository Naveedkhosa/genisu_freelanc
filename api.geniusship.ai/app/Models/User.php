<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user detail associated with the user.
     */
    public function userDetail(): HasOne
    {
        return $this->hasOne(UserDetail::class)->with('transporter');
    }

    /**
     * Get the vehicles associated with the user.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'driver_id');
    }

    /**
     * Get the route assignments for the user.
     */
    public function routeAssignments(): HasMany
    {
        return $this->hasMany(RouteAssignment::class, 'driver_id');
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'customer_id');
    }



    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function supportTicketMessages()
    {
        return $this->hasMany(SupportTicketMessage::class, 'user_id');
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function transporterBids()
    {
        return $this->hasMany(Bid::class, 'transporter_id');
    }

    public function driverBids()
    {
        return $this->hasMany(Bid::class, 'driver_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'customer_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InvoicePayment::class, 'customer_id');
    }

    public function driverPaymentsIn(): HasMany
    {
        return $this->hasMany(DriverPaymentsIn::class, 'driver_id');
    }

    public function driverPaymentsOut(): HasMany
    {
        return $this->hasMany(DriverPaymentsOut::class, 'driver_id');
    }

    public function adminPaymentsIn()
    {
        return $this->hasMany(AdminPaymentsIn::class, 'admin_id');
    }

    public function adminPaymentsOut()
    {
        return $this->hasMany(AdminPaymentsOut::class, 'admin_id');
    }

    public function userAddresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }
}

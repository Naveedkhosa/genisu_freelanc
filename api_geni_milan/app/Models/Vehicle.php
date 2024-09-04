<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_number',
        'model',
        'owner',
        'year',
        'status',
        'driver_id',
    ];

    /**
     * Get the driver that owns the vehicle.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the maintenance records for the vehicle.
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(VehicleMaintenance::class);
    }

    /**
     * Get the route assignments for the vehicle.
     */
    public function routeAssignments(): HasMany
    {
        return $this->hasMany(RouteAssignment::class);
    }
}

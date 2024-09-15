<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Route extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'start_location',
        'end_location',
        'distance_km',
        'estimated_time_minutes',
        'cost',
    ];

    /**
     * Get the route assignments for the route.
     */
    public function routeAssignments(): HasMany
    {
        return $this->hasMany(RouteAssignment::class);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\PackageType;
use App\Models\TruckType;
use App\Models\TruckBodyType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password'=>Hash::make('12345678'),
            'role'=>'Admin'
        ]);
        User::factory()->create([
            'name' => 'Transporter',
            'email' => 'transporter@gmail.com',
            'password'=>Hash::make('12345678'),
            'role'=>'Transporter'
        ]);
        User::factory()->create([
            'name' => 'Customer',
            'email' => 'customer@gmail.com',
            'password'=>Hash::make('12345678'),
            'role'=>'Customer'
        ]);
        User::factory()->create([
            'name' => 'Driver',
            'email' => 'driver@gmail.com',
            'password'=>Hash::make('12345678'),
            'role'=>'Driver'
        ]);

        // user addresses
        UserAddress::create([
            'user_id' => 3,
            'country' => 'Germany',
            'city' => 'Berlin',
            'full_address' => 'Alexanderplatz 1, 10178 Berlin',
            'longitude' => '13.4133',
            'latitude' => '52.5218'
        ]);
        UserAddress::create([
            'user_id' => 3,
            'country' => 'Germany',
            'city' => 'Munich',
            'full_address' => 'Marienplatz 1, 80331 Munich',
            'longitude' => '11.5754',
            'latitude' => '48.1371'
        ]);


        // package types
        PackageType::create(['name' => 'Euro Pallet']);
        PackageType::create(['name' => 'One Way Pallet']);
        PackageType::create(['name' => 'Half Pallet']);
        PackageType::create(['name' => 'Pallet Cage']);

        // truck types
        TruckType::create(['name' => 'Truck up to 3.5t']);
        TruckType::create(['name' => 'Truck up to 7.5t']);
        TruckType::create(['name' => 'Truck up to 12t']);
        TruckType::create(['name' => 'Articulated Truck']);
        TruckType::create(['name' => 'Rigid Truck']);

        // truck body types
        TruckBodyType::create(['name' => 'Box']);
        TruckBodyType::create(['name' => 'Car Transporter']);
        TruckBodyType::create(['name' => 'Coil trough']);
        TruckBodyType::create(['name' => 'Container Chassis']);
        TruckBodyType::create(['name' => 'Curtainsider']);

    }
}

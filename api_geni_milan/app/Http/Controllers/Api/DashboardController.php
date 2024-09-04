<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Shipment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Auth;

class DashboardController extends Controller
{
    // All stats dashboard
    public function index()
    {

        $total_shipments = Shipment::count();
        $total_pending_shipment = Shipment::where('status', '=', 'pending')->count();
        $total_order_confirmed_shipment = Shipment::where('status', '=', 'order_confirmed')->count();
        $total_pickup_shipment = Shipment::where('status', '=', 'pickup')->count();
        $total_in_transit_shipment = Shipment::where('status', '=', 'in_transit')->count();
        $total_delivered_shipment = Shipment::where('status', '=', 'delivered')->count();
        $total_cancelled_shipment = Shipment::where('status', '=', 'cancelled')->count();

        // Get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Create an array of all days in the current week
        $weekDays = [];
        for ($date = $startOfWeek->copy(); $date->lte($endOfWeek); $date->addDay()) {
            $weekDays[] = $date->format('Y-m-d');
        }

        // Convert the array to a collection for querying
        $weekDaysCollection = collect($weekDays);

        // Query to count drivers by weekday
        $driverCounts = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date, COUNT(id) as total')
            ->where('role', '=', 'Driver')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('date')
            ->pluck('total', 'date');

        // Query to count transporters by weekday
        $transporterCounts = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date, COUNT(id) as total')
            ->where('role', '=', 'Transporter')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('date')
            ->pluck('total', 'date');

        // Initialize counts to 0 for all weekdays
        $totalDrivers = $weekDaysCollection->mapWithKeys(function ($date) {
            return [$date => 0];
        })->merge($driverCounts);

        $totalTransporters = $weekDaysCollection->mapWithKeys(function ($date) {
            return [$date => 0];
        })->merge($transporterCounts);

        // Convert results to a more readable format
        $totalDriversByWeekday = $totalDrivers->mapWithKeys(function ($count, $date) {
            return [Carbon::parse($date)->format('l') => $count];
        });

        $totalTransportersByWeekday = $totalTransporters->mapWithKeys(function ($count, $date) {
            return [Carbon::parse($date)->format('l') => $count];
        });

        $drivers_data = [];
        $transporter_data = [];

        foreach ($totalDriversByWeekday as $key => $value) {
            array_push($drivers_data, $value);
        }
        foreach ($totalTransportersByWeekday as $key => $value) {
            array_push($transporter_data, $value);
        }

        $total_drivers = User::where('role', '=', 'Driver')->count();
        $total_transporters = User::where('role', '=', 'Transporter')->count();
        $total_customers = User::where('role', '=', 'Customer')->count();

        $response = [
            "shipment" => [
                'pending_total' => $total_pending_shipment,
                'order_confirmed_total' => $total_order_confirmed_shipment,
                'pickup_total' => $total_pickup_shipment,
                'in_transit_total' => $total_in_transit_shipment,
                'delivered_total' => $total_delivered_shipment,
                'cancelled_total' => $total_cancelled_shipment,
                'total_shipments' => $total_shipments,
            ],
            "total_drivers" => $drivers_data,
            "total_transporters" => $transporter_data,
            "stats" => [
                'total_drivers' => $total_drivers,
                'total_transporters' => $total_transporters,
                'total_customers' => $total_customers,
            ],
        ];
        return response()->json($response, 200);
    }

    public function customerShipments($id)
    {
        if ($id) {
            $total_shipments = Shipment::where('customer_id', '=', $id)->count();
            $total_pending_shipment = Shipment::where('customer_id', '=', $id)->where('status', '=', 'Pending')->count();
            $total_in_transit_shipment = Shipment::where('customer_id', '=', $id)->where('status', '=', 'in_transit')->count();
            $total_delivered_shipment = Shipment::where('customer_id', '=', $id)->where('status', '=', 'delivered')->count();
            $total_order_confirmed_shipment = Shipment::where('customer_id', '=', $id)->where('status', '=', 'order_confirmed')->count();
            $total_pickup_shipment = Shipment::where('customer_id', '=', $id)->where('status', '=', 'pickup')->count();

            $response = [
                "shipment" => [
                    'pending_total' => $total_pending_shipment,
                    'in_transit_total' => $total_in_transit_shipment,
                    'delivered_total' => $total_delivered_shipment,
                    'order_confirmed_total' => $total_order_confirmed_shipment,
                    'pickup_total' => $total_pickup_shipment,
                    'total_shipments' => $total_shipments,
                ],
            ];
            return response()->json($response, 200);
        }
        return response()->json("Missing parameter", 400);
    }
    public function driverShipmentsBids($id)
    {
        if ($id) {
            $total_bids = Bid::where('bidder_id', '=', $id)->count();
            $total_rejected_bids = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'rejected')->count();
            $total_accepted_bids = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'accepted')->count();
            $total_pending_bids = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'pending')->count();
            $all_time_earning = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'accepted')->sum('bid_amount');
            // today_earning
            $today_earning = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'accepted')->where('created_at', '>=', Carbon::today())->sum('bid_amount');

            // month_earning
            $month_earning = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'accepted')->where('created_at', '>=', Carbon::now()->startOfMonth())->sum('bid_amount');

            // week_earning
            $week_earning = Bid::where('bidder_id', '=', $id)->where('bid_status', '=', 'accepted')->where('created_at', '>=', Carbon::now()->startOfWeek())->sum('bid_amount');

            $response = [
                "bids" => [
                    'total_bids' => $total_bids,
                    'total_rejected_bids' => $total_rejected_bids,
                    'total_accepted_bids' => $total_accepted_bids,
                    'total_pending_bids' => $total_pending_bids,
                    'all_time_earning' => $all_time_earning,
                    'today_earning' => $today_earning,
                    'last_week_earning' => $week_earning,
                    'last_30_days_earning' => $month_earning,
                ],
            ];
            return response()->json($response, 200);
        }
        return response()->json("Missing parameter", 400);
    }

    public function dashboardStatisticsUsers()
    {
        // $user = Auth::user();
        // if ($user->role == "Customer") {
        // return response()->json($user->role, 200);
        // }
    }

}

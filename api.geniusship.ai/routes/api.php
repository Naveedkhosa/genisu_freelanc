<?php

use App\Http\Controllers\Api\AdminPaymentsInController;
use App\Http\Controllers\Api\AdminPaymentsOutController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DriverPaymentsInController;
use App\Http\Controllers\Api\DriverPaymentsOutController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\api\InvoiceController;
use App\Http\Controllers\Api\InvoicePaymentController;
use App\Http\Controllers\Api\PackagesTypeController;
use App\Http\Controllers\Api\PackageTypeController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\ShipmentTrackingController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\TruckBodyTypeController;
use App\Http\Controllers\Api\TruckTypeController;
use App\Http\Controllers\Api\UserAddressController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleMaintenanceController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayPalController;
use Illuminate\Http\Request;

// Payment Gateways
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('login', function () {
    return "You are Logged Out";
})->name('login');
Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login', [AuthController::class, 'login']);
// update locations
Route::post('update/locations/', [UserController::class, 'updateLocations']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // payment routes
    Route::post('/checkout/process', [PaymentController::class, 'checkoutprocess']);
    Route::post('/orders', [PaymentController::class, 'createOrder']);
    Route::post('checkout/success', [PaymentController::class, 'success']);
    
    // in-app chat routes
    Route::get('chat/rooms',[ChatController::class,'index']);
    Route::get('chat/{id}/messages',[ChatController::class,'messages']);
    Route::post('chat/message',[ChatController::class,'sendMessage']);

    // dashboard stats
    Route::get('dashboard/statistics/', [DashboardController::class, 'index']);
    Route::get('dashboard/statistics/{id}', [DashboardController::class, 'customerShipments']);
    Route::get('dashboard/driver/bids/{id}', [DashboardController::class, 'driverShipmentsBids']);

    // User CRUD
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // user address CRUD
    Route::get('user-addresses/{id}', [UserAddressController::class, 'getUserAddresses']);
    Route::delete('delete-address/{id}', [UserAddressController::class, 'deleteUserAddress']);

    // packages types crud
    Route::get('packages', [PackagesTypeController::class, 'index']);
    Route::get('packages/{id}', [PackagesTypeController::class, 'show']);
    Route::post('packages', [PackagesTypeController::class, 'store']);
    Route::put('packages/{id}', [PackagesTypeController::class, 'update']);
    Route::delete('packages/{id}', [PackagesTypeController::class, 'destroy']);

    // TruckTypeController cruds and TruckBodyTypeController crud
    Route::get('truck-types', [TruckTypeController::class, 'index']);
    Route::get('truck-types/{id}', [TruckTypeController::class, 'show']);
    Route::post('truck-types', [TruckTypeController::class, 'store']);
    Route::put('truck-types/{id}', [TruckTypeController::class, 'update']);
    Route::delete('truck-types/{id}', [TruckTypeController::class, 'destroy']);

    Route::get('truck-bodies', [TruckBodyTypeController::class, 'index']);
    Route::get('truck-bodies/{id}', [TruckBodyTypeController::class, 'show']);
    Route::post('truck-bodies', [TruckBodyTypeController::class, 'store']);
    Route::put('truck-bodies/{id}', [TruckBodyTypeController::class, 'update']);
    Route::delete('truck-bodies/{id}', [TruckBodyTypeController::class, 'destroy']);

    // Additional routes
    Route::get('all_customers', [UserController::class, 'getAllCustomers']);
    Route::get('all_transporters', [UserController::class, 'getAllTransporters']);
    Route::get('transporter_drivers/{transporter_id}', [UserController::class, 'getTransporterDrivers']);
    Route::get('all_drivers', [UserController::class, 'getAllDrivers']);

    // Vehicle CRUD
    Route::get('vehicles', [VehicleController::class, 'index']);
    Route::get('vehicles/{id}', [VehicleController::class, 'show']);
    Route::post('vehicles', [VehicleController::class, 'store']);
    Route::put('vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('vehicles/{id}', [VehicleController::class, 'destroy']);

    // Additional vehicle route
    Route::get('all_vehicles', [VehicleController::class, 'listAllVehicles']);

    // Vehicle Maintenance CRUD
    Route::get('vehicle-maintenance', [VehicleMaintenanceController::class, 'index']);
    Route::get('vehicle-maintenance/{id}', [VehicleMaintenanceController::class, 'show']);
    Route::post('vehicle-maintenance', [VehicleMaintenanceController::class, 'store']);
    Route::put('vehicle-maintenance/{id}', [VehicleMaintenanceController::class, 'update']);
    Route::delete('vehicle-maintenance/{id}', [VehicleMaintenanceController::class, 'destroy']);

    // Route CRUD
    Route::get('routes', [RouteController::class, 'index']);
    Route::get('routes/{id}', [RouteController::class, 'show']);
    Route::post('routes', [RouteController::class, 'store']);
    Route::put('routes/{id}', [RouteController::class, 'update']);
    Route::delete('routes/{id}', [RouteController::class, 'destroy']);

    // RouteAssignment update
    Route::post('route-assignments/{id}', [RouteController::class, 'updateRouteAssignment']);

    // Select driver by vehicle ID
    Route::get('vehicles/{vehicle_id}/driver', [RouteController::class, 'selectDriverByVehicleId']);

    // Shipment routes
    Route::get('shipments', [ShipmentController::class, 'index']);
    Route::get('shipments/{id}/{sortby?}', [ShipmentController::class, 'show']);
    Route::get('shipment/{id}/review', [ShipmentController::class, 'Review']);
    Route::post('shipments', [ShipmentController::class, 'store']);
    Route::put('shipments/{id}', [ShipmentController::class, 'update']);
    Route::delete('shipments/{id}', [ShipmentController::class, 'destroy']);
    // shipments by user
    Route::get('shipments/customer/{id}', [ShipmentController::class, 'shipmentByCustomer']);
    // driver bided & accepted/in-progress shipments
    Route::get('shipments/bids/{id}', [ShipmentController::class, 'shipmentsByDriver']);

    Route::get('shipment/track/{tracking_id}', [ShipmentController::class, 'trackShipment']);

// update shipment status
    Route::post('shipment/update', [ShipmentController::class, 'changeStatus']);

    // ShipmentTracking routes
    Route::get('shipment-tracking', [ShipmentTrackingController::class, 'index']);
    Route::get('tracking/history/{id}', [ShipmentTrackingController::class, 'TrackingHistory']);
    Route::get('shipment-tracking/{id}', [ShipmentTrackingController::class, 'show']);
    Route::post('shipment-tracking', [ShipmentTrackingController::class, 'store']);
    Route::put('shipment-tracking/{id}', [ShipmentTrackingController::class, 'update']);
    Route::delete('shipment-tracking/{id}', [ShipmentTrackingController::class, 'destroy']);

    // SupportTicket routes
    Route::get('support-tickets', [SupportTicketController::class, 'index']);
    Route::get('support-tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('support-tickets/{id}/messages', [SupportTicketController::class, 'storeMessage']);
    Route::post('support-tickets', [SupportTicketController::class, 'store']);
    Route::put('support-tickets/{id}', [SupportTicketController::class, 'update']);
    Route::put('support-tickets/{id}/status', [SupportTicketController::class, 'updateStatus']);
    Route::delete('support-tickets/{id}', [SupportTicketController::class, 'destroy']);

    // Feedback routes
    Route::get('feedback', [FeedbackController::class, 'index']);
    Route::get('feedback/{id}', [FeedbackController::class, 'show']);
    Route::post('feedback', [FeedbackController::class, 'store']);
    Route::put('feedback/{id}', [FeedbackController::class, 'update']);
    Route::delete('feedback/{id}', [FeedbackController::class, 'destroy']);

    // Bid routes
    Route::get('bids', [BidController::class, 'index']);
    Route::get('bids/{id}', [BidController::class, 'show']);
    Route::post('bids', [BidController::class, 'store']);
    Route::put('bids/{id}', [BidController::class, 'update']);
    Route::delete('bids/{id}', [BidController::class, 'destroy']);
    Route::get('/accept-request-offer/{id}', [BidController::class, 'acceptOffer']);
    Route::get('/reject-request-offer/{id}', [BidController::class, 'rejectOffer']);

    // Check User Bid
    Route::get('/current-user/{user_id}/{request_id}', [BidController::class, 'checkIfAlreadyApplied']);

    // Get drivers By Transporters
    Route::get('/bids/drivers/{transporter_id}', [BidController::class, 'getDriversByTransporter']);

    // Invoices Routes
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

    // Additional route for updating status
    Route::patch('/invoices/{id}/status', [InvoiceController::class, 'updateStatus']);

    // Invoice Payment Routes
    Route::get('/invoice-payments', [InvoicePaymentController::class, 'index']);
    Route::get('/invoice-payments/{id}', [InvoicePaymentController::class, 'show']);
    Route::post('/invoice-payments', [InvoicePaymentController::class, 'store']);
    Route::put('/invoice-payments/{id}', [InvoicePaymentController::class, 'update']);
    Route::delete('/invoice-payments/{id}', [InvoicePaymentController::class, 'destroy']);

    // Additional route for updating transaction and payment_date
    Route::patch('/invoice-payments/{id}/update-transaction-payment-date', [InvoicePaymentController::class, 'updateTransactionAndPaymentDate']);

    // Routes for DriverPaymentsIn
    Route::get('/driver-payments-in', [DriverPaymentsInController::class, 'index']);
    Route::get('/driver-payments-in/{id}', [DriverPaymentsInController::class, 'show']);
    Route::post('/driver-payments-in', [DriverPaymentsInController::class, 'store']);
    Route::put('/driver-payments-in/{id}', [DriverPaymentsInController::class, 'update']);
    Route::delete('/driver-payments-in/{id}', [DriverPaymentsInController::class, 'destroy']);

    // Routes for DriverPaymentsOut
    Route::get('/driver-payments-out', [DriverPaymentsOutController::class, 'index']);
    Route::get('/driver-payments-out/{id}', [DriverPaymentsOutController::class, 'show']);
    Route::post('/driver-payments-out', [DriverPaymentsOutController::class, 'store']);
    Route::put('/driver-payments-out/{id}', [DriverPaymentsOutController::class, 'update']);
    Route::delete('/driver-payments-out/{id}', [DriverPaymentsOutController::class, 'destroy']);

    // Additional route for updating payment_date and transaction in DriverPaymentsOut
    Route::patch('/driver-payments-out/{id}/update-payment-date-transaction', [DriverPaymentsOutController::class, 'updatePaymentDateAndTransaction']);

    // Routes for AdminPaymentsIn
    Route::get('/admin-payments-in', [AdminPaymentsInController::class, 'index']);
    Route::get('/admin-payments-in/{id}', [AdminPaymentsInController::class, 'show']);
    Route::post('/admin-payments-in', [AdminPaymentsInController::class, 'store']);
    Route::put('/admin-payments-in/{id}', [AdminPaymentsInController::class, 'update']);
    Route::delete('/admin-payments-in/{id}', [AdminPaymentsInController::class, 'destroy']);

    // Routes for AdminPaymentsOut
    Route::get('/admin-payments-out', [AdminPaymentsOutController::class, 'index']);
    Route::get('/admin-payments-out/{id}', [AdminPaymentsOutController::class, 'show']);
    Route::post('/admin-payments-out', [AdminPaymentsOutController::class, 'store']);
    Route::put('/admin-payments-out/{id}', [AdminPaymentsOutController::class, 'update']);
    Route::delete('/admin-payments-out/{id}', [AdminPaymentsOutController::class, 'destroy']);

    // Additional route for updating payment_date and transaction in AdminPaymentsOut
    Route::patch('/admin-payments-out/{id}/update-payment-date-transaction', [AdminPaymentsOutController::class, 'updatePaymentDateAndTransaction']);

    // Request
    Route::post('/requests', [RequestController::class, 'store']);
    Route::get('/requests', [RequestController::class, 'index']);
    Route::get('/request/{id}', [RequestController::class, 'show']);
    Route::get('/customer-requests/{id}', [RequestController::class, 'customer_index']);
    Route::delete('/requests/{id}', [RequestController::class, 'destroy']);

    Route::get('/customer-shipments/{user_id}', [RequestController::class, 'getAllShipments']);

    // Package Types
    Route::get('/package-types', [PackageTypeController::class, 'index']); // List all package types
    Route::get('/package-types/{id}', [PackageTypeController::class, 'show']); // Show a single package type
    Route::post('/package-types', [PackageTypeController::class, 'store']); // Create a new package type
    Route::put('/package-types/{id}', [PackageTypeController::class, 'update']); // Update an existing package type
    Route::delete('/package-types/{id}', [PackageTypeController::class, 'destroy']); // Delete a package type

    Route::get('/truck-types', [TruckTypeController::class, 'index']); // List all truck types
    Route::get('/truck-types/{id}', [TruckTypeController::class, 'show']); // Show a single truck type
    Route::post('/truck-types', [TruckTypeController::class, 'store']); // Create a new truck type
    Route::put('/truck-types/{id}', [TruckTypeController::class, 'update']); // Update an existing truck type
    Route::delete('/truck-types/{id}', [TruckTypeController::class, 'destroy']); // Delete a truck type

    Route::get('/truck-body-types', [TruckBodyTypeController::class, 'index']); // List all truck body types
    Route::get('/truck-body-types/{id}', [TruckBodyTypeController::class, 'show']); // Show a single truck body type
    Route::post('/truck-body-types', [TruckBodyTypeController::class, 'store']); // Create a new truck body type
    Route::put('/truck-body-types/{id}', [TruckBodyTypeController::class, 'update']); // Update an existing truck body type
    Route::delete('/truck-body-types/{id}', [TruckBodyTypeController::class, 'destroy']); // Delete a truck body type
});

// Paypal Controller
Route::post('process-transaction', [PayPalController::class, 'processTransaction']);
// Route::get('success-transaction', [PayPalController::class, 'successTransaction'])->name('api.successTransaction');
// Route::get('cancel-transaction', [PayPalController::class, 'cancelTransaction'])->name('api.cancelTransaction');

// Testing Pusher
Route::get('/testing-routes', function () {
    $message = "Say Hi! From Pusher";
    $pusher = app('pusher');
    $resp = $pusher->trigger('CustomChannel', 'UserNotification', [
        'message' => $message,
    ]);
    return response()->json(["response" => $resp, "Message" => "$message Sent Successfully"], 200);
});

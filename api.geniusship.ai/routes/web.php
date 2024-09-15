<?php

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return Hash::make('12345678');
});

Route::get('/run-optimize', function () {
    try {
        // Attempt to run the optimize command
        Artisan::call('queue:work');
        return response()->json(['message' => 'Optimize command executed successfully.']);
    } catch (\Exception $e) {
        // Handle any errors that occur
        return response()->json(['error' => 'Failed to execute optimize command.', 'details' => $e->getMessage()], 500);
    }
});

Route::get('/run-storage-link', function () {
    try {
        // Attempt to run the storage:link command
        Artisan::call('storage:link');
        return response()->json(['message' => 'Storage:link command executed successfully.']);
    } catch (\Exception $e) {
        // Handle any errors that occur
        return response()->json(['error' => 'Failed to execute storage:link command.', 'details' => $e->getMessage()], 500);
    }
});

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('customer_id');
            $table->foreign('customer_id')->references('id')->on('users');
            $table->bigInteger('bidder_id');
            $table->foreign('bidder_id')->references('id')->on('users');
            $table->bigInteger('shipment_id');
            $table->foreign('shipment_id')->references('id')->on('shipments');
            $table->text('room_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_rooms');
    }
};

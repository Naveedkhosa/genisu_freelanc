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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('pickup_city');
            $table->string('pickup_address');
            $table->string('destination_city');
            $table->string('destination_address');
            $table->string('pickup_coordinates')->nullable();
            $table->string('destination_coordinates')->nullable();
            $table->decimal('fare', 10, 2);
            $table->text('description')->nullable();
            $table->time('time');
            $table->date('date');
            $table->string('payment_status')->nullable();
            $table->string('payment_url')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};

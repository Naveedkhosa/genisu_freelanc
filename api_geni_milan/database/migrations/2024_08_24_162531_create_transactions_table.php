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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('payment_id')->unique();
            $table->unsignedBigInteger('bid_id');
            $table->string('payer_name')->nullable();
            $table->string('payer_email')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->enum('payment_status',["processing","completed","failed"])->default('processing');
            $table->string('payment_method')->default('PayPal');
            $table->foreign('bid_id')
                ->references('id')
                ->on('bids')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

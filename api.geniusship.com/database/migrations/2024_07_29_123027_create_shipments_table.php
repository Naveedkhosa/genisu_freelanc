<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->uniqiue();
            $table->unsignedBigInteger('customer_id');
            $table->string('pickup_address');
            $table->string('destination_address');
            $table->string('pickup_address_coords');
            $table->string('destination_address_coords');
            $table->string('pickup_time');
            $table->date('pickup_date');
            $table->date('destination_date');
            $table->string('truck_type');
            $table->string('truck_body_type');
            $table->decimal('expected_price',10,2);
            $table->string('pickup_contact_name');
            $table->string('pickup_contact_phone');
            $table->string('drop_contact_name');
            $table->string('drop_contact_phone');
            $table->string('total_weight', 10, 2);
            $table->string('length', 10, 2);
            $table->string('type_of_goods');
            $table->text('notes')->nullable()->default(null);
            $table->enum('status', ['pending','order_confirmed','pickup','in_transit','delivered'])->default('pending')->nullable();
            $table->timestamps();
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shipments');
    }
}

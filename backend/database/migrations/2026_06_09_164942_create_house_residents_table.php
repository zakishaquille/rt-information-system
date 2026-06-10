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
        Schema::create('house_residents', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('house_id');
            $table->unsignedInteger('resident_id');
            $table->boolean('is_pic')->default(false);
            $table->date('moved_in_at')->nullable();
            $table->date('moved_out_at')->nullable();
            $table->timestamps();

            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
            $table->foreign('resident_id')->references('id')->on('residents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('house_residents');
    }
};

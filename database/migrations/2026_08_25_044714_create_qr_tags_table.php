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
        Schema::create('qr_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_report_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique();
            $table->enum('status', ['active', 'scanned', 'handed_over'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_tags');
    }
};

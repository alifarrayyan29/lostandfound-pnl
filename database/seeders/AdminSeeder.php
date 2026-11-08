<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['nim' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@pnl.ac.id',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'admin',
                'whatsapp_number' => '081234567890'
            ]
        );
    }
}

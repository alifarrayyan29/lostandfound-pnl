<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'nim' => 'testuser',
            'email' => 'test@example.com',
            'whatsapp_number' => '08111111111'
        ]);

        $this->call([
            AdminSeeder::class,
            BadgeSeeder::class,
            CategorySeeder::class,
            BuildingSeeder::class,
            DummyDataSeeder::class,
        ]);
    }
}

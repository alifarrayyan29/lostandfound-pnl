<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Pemula',
                'description' => 'Mendapatkan 10 poin pertama dari partisipasi.',
                'icon' => '🌟', // Bisa URL image SVG
                'point_threshold' => 10,
            ],
            [
                'name' => 'Penemu Aktif',
                'description' => 'Telah mengumpulkan 50 poin. Terima kasih atas kejujurannya!',
                'icon' => '🏅',
                'point_threshold' => 50,
            ],
            [
                'name' => 'Pahlawan Kampus',
                'description' => 'Mengumpulkan lebih dari 100 poin! Anda adalah teladan!',
                'icon' => '👑',
                'point_threshold' => 100,
            ]
        ];

        foreach ($badges as $badge) {
            \App\Models\Badge::firstOrCreate(['name' => $badge['name']], $badge);
        }
    }
}

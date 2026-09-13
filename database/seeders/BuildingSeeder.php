<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $buildings = ['Gedung Utama', 'Gedung Tata Niaga', 'Laboratorium Komputer', 'Perpustakaan', 'Kantin', 'Area Parkir', 'Lainnya'];
        foreach ($buildings as $building) {
            \App\Models\Building::create(['name' => $building]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Building;
use App\Models\ItemReport;
use App\Models\Claim;
use App\Models\QrTag;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Dummy Users for Leaderboard
        $users = [
            ['name' => 'Budi Santoso', 'nim' => '2201010000001', 'email' => 'budi@mhs.pnl.ac.id', 'major' => 'Teknik Informatika', 'phone' => '081234567801', 'points' => 120, 'role' => 'user'],
            ['name' => 'Siti Aminah', 'nim' => '2201020000002', 'email' => 'siti@mhs.pnl.ac.id', 'major' => 'Teknik Sipil', 'phone' => '081234567802', 'points' => 85, 'role' => 'user'],
            ['name' => 'Ahmad Reza', 'nim' => '2201030000003', 'email' => 'ahmad@mhs.pnl.ac.id', 'major' => 'Teknik Mesin', 'phone' => '081234567803', 'points' => 60, 'role' => 'user'],
            ['name' => 'Putri Lestari', 'nim' => '2201040000004', 'email' => 'putri@mhs.pnl.ac.id', 'major' => 'Akuntansi', 'phone' => '081234567804', 'points' => 45, 'role' => 'user'],
            ['name' => 'Rizky Pratama', 'nim' => '2201050000005', 'email' => 'rizky@mhs.pnl.ac.id', 'major' => 'Administrasi Bisnis', 'phone' => '081234567805', 'points' => 20, 'role' => 'user'],
        ];

        $createdUsers = [];
        foreach ($users as $u) {
            $createdUsers[] = User::firstOrCreate(
                ['nim' => $u['nim']],
                [
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'major' => $u['major'],
                    'password' => bcrypt('password'),
                    'points' => $u['points'],
                    'role' => $u['role'],
                    'whatsapp_number' => $u['phone']
                ]
            );
        }

        // Get some categories and buildings
        $categories = Category::all();
        $buildings = Building::all();

        if ($categories->isEmpty() || $buildings->isEmpty()) {
            return; // Safety check
        }

        // 2. Create Dummy Reports
        $reportsData = [
            ['title' => 'Kunci Motor Honda Beat', 'type' => 'found', 'status' => 'new'],
            ['title' => 'Dompet Kulit Cokelat', 'type' => 'lost', 'status' => 'verified'],
            ['title' => 'KTM a/n Budi', 'type' => 'found', 'status' => 'new'],
            ['title' => 'Flashdisk 32GB Sandisk', 'type' => 'found', 'status' => 'claimed'],
            ['title' => 'Jaket Himpunan', 'type' => 'lost', 'status' => 'new'],
            ['title' => 'Helm Bogo Hitam', 'type' => 'found', 'status' => 'closed'],
            ['title' => 'Buku Catatan Pemrograman', 'type' => 'lost', 'status' => 'closed'],
            ['title' => 'Botol Minum Tupperware', 'type' => 'found', 'status' => 'new'],
            ['title' => 'Kacamata Minus Frame Hitam', 'type' => 'lost', 'status' => 'new'],
            ['title' => 'Jam Tangan Casio', 'type' => 'found', 'status' => 'closed'],
        ];

        foreach ($reportsData as $data) {
            $report = ItemReport::create([
                'user_id' => collect($createdUsers)->random()->id,
                'category_id' => $categories->random()->id,
                'building_id' => $buildings->random()->id,
                'title' => $data['title'],
                'type' => $data['type'],
                'status' => $data['status'],
                'description' => 'Dummy data description untuk barang ' . $data['title'],
                'latitude' => 5.1189 + (rand(-10, 10) / 10000), // Randomize slightly around PNL
                'longitude' => 97.1574 + (rand(-10, 10) / 10000),
            ]);

            // If it's a found item, occasionally generate a QR Tag for it
            if ($data['type'] === 'found') {
                $qrStatus = $data['status'] === 'closed' ? 'handed_over' : 'active';
                QrTag::create([
                    'item_report_id' => $report->id,
                    'code' => Str::uuid()->toString(),
                    'status' => $qrStatus
                ]);
            }

            // If it's claimed or closed, create a dummy claim
            if (in_array($data['status'], ['claimed', 'closed'])) {
                $claimer = collect($createdUsers)->where('id', '!=', $report->user_id)->random();
                Claim::create([
                    'item_report_id' => $report->id,
                    'claimant_id' => $claimer->id,
                    'proof_description' => 'Ini barang saya, warnanya sesuai dengan foto.',
                    'status' => $data['status'] === 'closed' ? 'approved' : 'pending',
                ]);
            }
        }
    }
}

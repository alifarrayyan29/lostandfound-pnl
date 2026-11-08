<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Claim;
use App\Models\ItemReport;
use App\Models\QrTag;
use App\Notifications\ClaimStatusUpdated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Klaim yang masih menunggu verifikasi (Pending)
        $pendingClaims = Claim::with(['itemReport.category', 'itemReport.building', 'itemReport.user', 'claimant'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        // Riwayat klaim yang sudah diverifikasi (Approved / Rejected)
        $reviewedClaims = Claim::with(['itemReport.category', 'itemReport.building', 'itemReport.user', 'claimant', 'reviewer'])
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('reviewed_at')
            ->get();
        
        $reports = ItemReport::with(['user', 'category', 'building', 'qrTag'])->latest()->get();
        $qrTags = QrTag::all()->keyBy('item_report_id');

        $stats = [
            'total_reports' => ItemReport::count(),
            'pending_claims' => Claim::where('status', 'pending')->count(),
            'resolved_claims' => Claim::where('status', 'approved')->count(),
        ];

        // Analytics Data sesuai siklus status PRD
        $chartData = [
            'type_distribution' => [
                'lost' => ItemReport::where('type', 'lost')->count(),
                'found' => ItemReport::where('type', 'found')->count(),
            ],
            'status_distribution' => [
                'new' => ItemReport::where('status', 'new')->count(),
                'claimed' => ItemReport::where('status', 'claimed')->count(),
                'closed' => ItemReport::where('status', 'closed')->count(),
            ]
        ];

        return Inertia::render('Admin/Dashboard', [
            'claims' => $pendingClaims,
            'reviewedClaims' => $reviewedClaims,
            'reports' => $reports,
            'qrTags' => $qrTags,
            'stats' => $stats,
            'chartData' => $chartData
        ]);
    }

    public function updateClaimStatus(Request $request, Claim $claim)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:1000'
        ]);

        // Aturan PRD: Keputusan hanya boleh dilakukan pada klaim berstatus pending
        if ($claim->status !== 'pending') {
            return redirect()->back()->with('error', 'Hanya klaim dengan status pending yang dapat diverifikasi.');
        }

        // Operasi database atomik menggunakan transaksi (PRD Aturan Wajib)
        DB::transaction(function () use ($claim, $validated) {
            $status = $validated['status'];
            $rejectionReason = $status === 'rejected' 
                ? ($validated['rejection_reason'] ?? 'Bukti kepemilikan yang dilampirkan belum mencukupi.')
                : null;

            $claim->update([
                'status' => $status,
                'rejection_reason' => $rejectionReason,
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

            // Beri tahu pengklaim hasil verifikasi
            $claim->claimant->notify(new ClaimStatusUpdated($claim, $status));

            if ($status === 'approved') {
                // 1. Ubah status barang temuan menjadi 'claimed'
                $claim->itemReport->update([
                    'status' => 'claimed'
                ]);
                
                // 2. Buat / aktifkan QR code serah terima untuk laporan ini
                QrTag::updateOrCreate(
                    ['item_report_id' => $claim->item_report_id],
                    [
                        'code' => (string) Str::uuid(), 
                        'status' => 'active'
                    ]
                );
                
                // 3. Otomatis tolak klaim pending lain untuk barang yang sama & kirim notifikasi (PRD Alur 2)
                $otherPendingClaims = Claim::where('item_report_id', $claim->item_report_id)
                    ->where('id', '!=', $claim->id)
                    ->where('status', 'pending')
                    ->get();

                foreach ($otherPendingClaims as $otherClaim) {
                    $otherClaim->update([
                        'status' => 'rejected',
                        'rejection_reason' => 'Barang temuan ini telah diverifikasi dan disahkan kepada pengklaim lain dengan bukti sah.',
                        'reviewed_by' => auth()->id(),
                        'reviewed_at' => now()
                    ]);

                    $otherClaim->claimant->notify(new ClaimStatusUpdated($otherClaim, 'rejected'));
                }
            }
        });

        return redirect()->back()->with('success', 'Status klaim berhasil diverifikasi dan data telah diperbarui.');
    }

}

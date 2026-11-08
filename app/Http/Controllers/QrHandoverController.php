<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrTag;
use App\Models\Claim;
use Illuminate\Support\Facades\DB;

class QrHandoverController extends Controller
{
    public function scan($code)
    {
        $qr = QrTag::where('code', $code)->with(['itemReport.user', 'itemReport.category', 'itemReport.building'])->firstOrFail();
        
        // Verifikasi bahwa user yang men-scan adalah claimant (pemilik barang) yang klaimnya disetujui
        $isAuthorized = Claim::where('item_report_id', $qr->item_report_id)
            ->where('claimant_id', auth()->id())
            ->where('status', 'approved')
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Akses ditolak. Hanya pengklaim sah yang disetujui yang dapat memindai QR Code ini.');
        }

        // Jika QR sudah pernah dipakai serah terima (AC-09)
        if ($qr->status === 'handed_over' || $qr->itemReport->status === 'closed') {
            return redirect()->route('dashboard')->with('error', 'Serah terima untuk barang ini sudah selesai dilakukan sebelumnya.');
        }
        
        return Inertia::render('Handover/Scan', [
            'qr' => $qr
        ]);
    }

    public function confirmHandover(Request $request)
    {
        $validated = $request->validate(['code' => 'required|exists:qr_tags,code']);
        $qr = QrTag::where('code', $validated['code'])->with('itemReport.user')->firstOrFail();
        
        // Verifikasi otorisasi pengklaim
        $isAuthorized = Claim::where('item_report_id', $qr->item_report_id)
            ->where('claimant_id', auth()->id())
            ->where('status', 'approved')
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk mengonfirmasi serah terima barang ini.');
        }

        // Cek ketat (AC-09, AC-10): QR harus active dan laporan claimed, mencegah perulangan poin
        if ($qr->status !== 'active' || $qr->itemReport->status !== 'claimed') {
            return redirect()->route('dashboard')->with('error', 'Serah terima gagal: QR Code ini sudah pernah digunakan atau transaksi sudah selesai.');
        }

        DB::transaction(function () use ($qr) {
            $qr->update(['status' => 'handed_over']);
            $itemReport = $qr->itemReport;
            $itemReport->update(['status' => 'closed']);
            
            // Berikan poin kepada penemu barang (hanya 1 kali per transaksi sah)
            if ($itemReport->type === 'found' && $itemReport->user_id) {
                $user = $itemReport->user;
                $user->increment('points', 10);
                
                // Periksa perolehan badge baru
                $earnedBadgeIds = $user->badges()->pluck('badges.id')->toArray();
                $newBadges = \App\Models\Badge::where('point_threshold', '<=', $user->points)
                                              ->whereNotIn('id', $earnedBadgeIds)
                                              ->get();
                
                foreach ($newBadges as $badge) {
                    $user->badges()->attach($badge->id);
                }
            }
        });
        
        return redirect()->route('dashboard')->with('success', 'Barang telah berhasil diterima, laporan resmi ditutup. Terima kasih!');
    }

    public function generate(Request $request, \App\Models\ItemReport $report)
    {
        // 1. Pastikan yang mengakses adalah pelapor / penemu barang
        if (auth()->id() !== $report->user_id) {
            abort(403, 'Hanya pembuat laporan yang dapat mengenerate QR Code.');
        }

        // 2. Pastikan laporan bertipe 'found' dan status 'claimed' (disetujui admin)
        if ($report->type !== 'found' || $report->status !== 'claimed') {
            return redirect()->back()->with('error', 'QR Code hanya dapat digenerate setelah klaim disetujui oleh Admin.');
        }

        // 3. Pastikan ada klaim yang disetujui untuk laporan ini
        $hasApprovedClaim = Claim::where('item_report_id', $report->id)
            ->where('status', 'approved')
            ->exists();

        if (!$hasApprovedClaim) {
            return redirect()->back()->with('error', 'Belum ada pengajuan klaim yang disetujui untuk barang ini.');
        }

        // 4. Buat atau perbarui QR Code aktif
        QrTag::updateOrCreate(
            ['item_report_id' => $report->id],
            [
                'code' => (string) \Illuminate\Support\Str::uuid(),
                'status' => 'active'
            ]
        );

        return redirect()->back()->with('success', 'QR Code serah terima berhasil digenerate! Silakan tunjukkan ke pengklaim barang.');
    }
}

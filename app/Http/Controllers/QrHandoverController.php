<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrTag;
use App\Models\Claim;

class QrHandoverController extends Controller
{
    public function scan($code)
    {
        $qr = QrTag::where('code', $code)->with(['itemReport.user', 'itemReport.category'])->firstOrFail();
        
        // Verifikasi bahwa user yang men-scan adalah claimant (pemilik barang) yang klaimnya disetujui
        $isAuthorized = Claim::where('item_report_id', $qr->item_report_id)
            ->where('claimant_id', auth()->id())
            ->where('status', 'approved')
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Akses ditolak. Hanya pemilik sah yang klaimnya disetujui yang dapat memindai QR Code ini.');
        }
        
        return Inertia::render('Handover/Scan', [
            'qr' => $qr
        ]);
    }

    public function confirmHandover(Request $request)
    {
        $validated = $request->validate(['code' => 'required|exists:qr_tags,code']);
        $qr = QrTag::where('code', $validated['code'])->firstOrFail();
        
        // Verifikasi lagi
        $isAuthorized = Claim::where('item_report_id', $qr->item_report_id)
            ->where('claimant_id', auth()->id())
            ->where('status', 'approved')
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Unauthorized action.');
        }

        $qr->update(['status' => 'handed_over']);
        $itemReport = $qr->itemReport;
        $itemReport->update(['status' => 'closed']);
        
        // Award points if the original reporter found the item
        if ($itemReport->type === 'found' && $itemReport->user_id) {
            $user = $itemReport->user;
            $user->increment('points', 10);
            
            // Check for new badges
            $earnedBadgeIds = $user->badges()->pluck('badges.id')->toArray();
            $newBadges = \App\Models\Badge::where('point_threshold', '<=', $user->points)
                                          ->whereNotIn('id', $earnedBadgeIds)
                                          ->get();
            
            foreach ($newBadges as $badge) {
                $user->badges()->attach($badge->id);
            }
        }
        
        return redirect()->route('dashboard')->with('success', 'Barang telah berhasil diterima, laporan ditutup. Terima kasih!');
    }
}

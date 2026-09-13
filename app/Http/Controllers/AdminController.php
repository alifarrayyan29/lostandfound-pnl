<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Claim;
use App\Models\ItemReport;

class AdminController extends Controller
{
    public function dashboard()
    {
        $claims = Claim::with(['itemReport', 'claimant'])->latest()->get();
        
        $reports = ItemReport::with('user')->latest()->get();
        $qrTags = \App\Models\QrTag::all()->keyBy('item_report_id');

        $stats = [
            'total_reports' => ItemReport::count(),
            'pending_claims' => Claim::where('status', 'pending')->count(),
            'resolved_claims' => Claim::where('status', 'approved')->count(),
        ];

        // Analytics Data
        $chartData = [
            'type_distribution' => [
                'lost' => ItemReport::where('type', 'lost')->count(),
                'found' => ItemReport::where('type', 'found')->count(),
            ],
            'status_distribution' => [
                'new' => ItemReport::where('status', 'new')->count(),
                'verified' => ItemReport::where('status', 'verified')->count(),
                'claimed' => ItemReport::where('status', 'claimed')->count(),
                'closed' => ItemReport::where('status', 'closed')->count(),
            ]
        ];

        return Inertia::render('Admin/Dashboard', [
            'claims' => $claims,
            'reports' => $reports,
            'qrTags' => $qrTags,
            'stats' => $stats,
            'chartData' => $chartData
        ]);
    }

    public function updateClaimStatus(Request $request, Claim $claim)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $claim->update([
            'status' => $validated['status'],
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $claim->claimant->notify(new \App\Notifications\ClaimStatusUpdated($claim, $validated['status']));

        if ($validated['status'] === 'approved') {
            // Ubah status barang temuan menjadi claimed/resolved
            $claim->itemReport->update([
                'status' => 'claimed'
            ]);
            
            // Tolak klaim lain (jika ada) untuk barang yang sama
            Claim::where('item_report_id', $claim->item_report_id)
                ->where('id', '!=', $claim->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'rejected',
                    'reviewed_by' => auth()->id(),
                    'reviewed_at' => now()
                ]);
        }

        return redirect()->back()->with('success', 'Status klaim berhasil diperbarui.');
    }

    public function generateQr(Request $request)
    {
        $validated = $request->validate(['item_report_id' => 'required|exists:item_reports,id']);
        
        $qr = \App\Models\QrTag::firstOrCreate(
            ['item_report_id' => $validated['item_report_id']],
            ['code' => (string) \Illuminate\Support\Str::uuid(), 'status' => 'active']
        );
        
        return back()->with('success', 'QR Code berhasil dibuat.');
    }

    public function scanQr($code)
    {
        $qr = \App\Models\QrTag::where('code', $code)->with(['itemReport.user', 'itemReport.category'])->firstOrFail();
        
        return Inertia::render('Admin/Scan', [
            'qr' => $qr
        ]);
    }

    public function confirmHandover(Request $request)
    {
        $validated = $request->validate(['code' => 'required|exists:qr_tags,code']);
        $qr = \App\Models\QrTag::where('code', $validated['code'])->first();
        
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
        
        return redirect()->route('admin.dashboard')->with('success', 'Barang telah berhasil diserahterimakan, laporan ditutup, dan poin diberikan kepada penemu!');
    }
}

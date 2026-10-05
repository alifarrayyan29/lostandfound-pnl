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
            
            // Otomatis generate QR code untuk diserahkan
            \App\Models\QrTag::firstOrCreate(
                ['item_report_id' => $claim->item_report_id],
                ['code' => (string) \Illuminate\Support\Str::uuid(), 'status' => 'active']
            );
            
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

}

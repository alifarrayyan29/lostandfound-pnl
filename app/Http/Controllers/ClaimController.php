<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\ItemReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ClaimController extends Controller
{
    public function index()
    {
        // Menampilkan daftar klaim yang diajukan oleh user yang sedang login
        $claims = Claim::with(['itemReport.category', 'itemReport.building'])
            ->where('claimant_id', auth()->id())
            ->latest()
            ->get();
            
        return Inertia::render('Claims/Index', [
            'claims' => $claims
        ]);
    }

    public function create(Request $request)
    {
        $reportId = $request->query('report_id');
        if (!$reportId) {
            return redirect()->route('reports.index')->with('error', 'Laporan tidak ditemukan.');
        }

        $report = ItemReport::with(['category', 'building', 'user'])->findOrFail($reportId);

        // Validasi: hanya bisa mengklaim barang 'found' (ditemukan)
        if ($report->type !== 'found') {
            return redirect()->route('reports.show', $report->id)->with('error', 'Hanya barang temuan yang bisa diklaim.');
        }

        // Validasi: barang harus berstatus 'new' (masih dapat diklaim)
        if ($report->status !== 'new') {
            return redirect()->route('reports.show', $report->id)->with('error', 'Barang ini sudah diklaim atau serah terima sudah selesai.');
        }

        // Validasi: tidak bisa mengklaim barang sendiri
        if ($report->user_id === auth()->id()) {
            return redirect()->route('reports.show', $report->id)->with('error', 'Anda tidak bisa mengklaim laporan yang Anda buat sendiri.');
        }

        // Validasi: cek apakah user sudah pernah mengajukan klaim untuk barang ini (AC-04)
        $existingClaim = Claim::where('item_report_id', $report->id)
            ->where('claimant_id', auth()->id())
            ->first();

        if ($existingClaim) {
            return redirect()->route('claims.index')->with('error', 'Anda sudah mengajukan klaim untuk barang ini.');
        }

        return Inertia::render('Claims/Create', [
            'report' => $report
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_report_id' => 'required|exists:item_reports,id',
            'proof_description' => 'required|string',
            'proof_photo' => 'nullable|image|max:2048',
        ]);

        $report = ItemReport::findOrFail($validated['item_report_id']);

        if ($report->type !== 'found') {
            return redirect()->route('reports.index')->with('error', 'Hanya barang temuan yang bisa diklaim.');
        }

        if ($report->status !== 'new') {
            return redirect()->route('reports.show', $report->id)->with('error', 'Barang ini sudah tidak dapat diklaim lagi.');
        }

        if ($report->user_id === auth()->id()) {
            return redirect()->route('reports.show', $report->id)->with('error', 'Anda tidak bisa mengklaim barang yang Anda laporkan sendiri.');
        }

        // Validasi duplikasi klaim di level backend (AC-04)
        $alreadyClaimed = Claim::where('item_report_id', $report->id)
            ->where('claimant_id', auth()->id())
            ->exists();

        if ($alreadyClaimed) {
            return redirect()->route('claims.index')->with('error', 'Anda sudah mengajukan klaim untuk barang ini.');
        }

        $photoPath = null;
        if ($request->hasFile('proof_photo')) {
            $photoPath = $request->file('proof_photo')->store('claims', 'public');
        }

        $claim = Claim::create([
            'item_report_id' => $report->id,
            'claimant_id' => auth()->id(),
            'proof_description' => $validated['proof_description'],
            'proof_photo_path' => $photoPath,
            'status' => 'pending'
        ]);

        if ($report->user) {
            $report->user->notify(new \App\Notifications\NewClaimNotification($claim));
        }

        return redirect()->route('claims.index')->with('success', 'Klaim berhasil diajukan. Mohon tunggu verifikasi dari Admin.');
    }

    public function show(Claim $claim)
    {
        if (auth()->id() !== $claim->claimant_id && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $claim->load(['itemReport.category', 'itemReport.building', 'itemReport.user']);
        
        return Inertia::render('Claims/Show', [
            'claim' => $claim
        ]);
    }
}

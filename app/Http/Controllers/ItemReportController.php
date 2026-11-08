<?php

namespace App\Http\Controllers;

use App\Models\ItemReport;
use App\Models\Category;
use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ItemReportController extends Controller
{
    public function index(Request $request)
    {
        $query = ItemReport::with(['user', 'category', 'building'])->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('building_id')) {
            $query->where('building_id', $request->building_id);
        }

        $reports = $query->get();
        return Inertia::render('ItemReports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['search', 'type', 'category_id', 'building_id']),
            'categories' => Category::all(),
            'buildings' => Building::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('ItemReports/Create', [
            'categories' => Category::all(),
            'buildings' => Building::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:lost,found',
            'category_id' => 'required|exists:categories,id',
            'building_id' => 'required|exists:buildings,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('reports', 'public');
        }

        ItemReport::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'category_id' => $validated['category_id'],
            'building_id' => $validated['building_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'photo_path' => $photoPath,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'status' => 'new'
        ]);

        return redirect()->route('reports.index')->with('success', 'Laporan berhasil dibuat.');
    }

    public function show(ItemReport $report)
    {
        $report->load(['user', 'category', 'building', 'qrTag']);
        
        $userClaim = null;
        if (auth()->check()) {
            $userClaim = \App\Models\Claim::where('item_report_id', $report->id)
                ->where('claimant_id', auth()->id())
                ->first();
        }

        // Ambil data pengklaim yang disahkan/disetujui admin
        $approvedClaim = null;
        if ($report->status === 'claimed' || $report->status === 'closed') {
            $approvedClaim = \App\Models\Claim::with('claimant')
                ->where('item_report_id', $report->id)
                ->where('status', 'approved')
                ->first();
        }

        return Inertia::render('ItemReports/Show', [
            'report' => $report,
            'userClaim' => $userClaim,
            'approvedClaim' => $approvedClaim,
            'hasClaimed' => (bool) $userClaim,
            'qrCodeUrl' => $report->qrTag && $report->qrTag->status === 'active' 
                ? route('qr.scan', $report->qrTag->code) 
                : null
        ]);
    }

    public function edit(ItemReport $report)
    {
        // Check authorization (hanya pembuat laporan atau admin)
        if (auth()->id() !== $report->user_id) {
            abort(403);
        }

        return Inertia::render('ItemReports/Edit', [
            'report' => $report,
            'categories' => Category::all(),
            'buildings' => Building::all()
        ]);
    }

    public function update(Request $request, ItemReport $report)
    {
        if (auth()->id() !== $report->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:lost,found',
            'category_id' => 'required|exists:categories,id',
            'building_id' => 'required|exists:buildings,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable|in:new,verified,claimed,resolved,closed'
        ]);

        if ($request->hasFile('photo')) {
            if ($report->photo_path) {
                Storage::disk('public')->delete($report->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('reports', 'public');
        }

        $report->update($validated);

        return redirect()->route('reports.index')->with('success', 'Laporan berhasil diperbarui.');
    }

    public function destroy(ItemReport $report)
    {
        if (auth()->id() !== $report->user_id) {
            abort(403);
        }

        if ($report->photo_path) {
            Storage::disk('public')->delete($report->photo_path);
        }

        $report->delete();

        return redirect()->route('reports.index')->with('success', 'Laporan berhasil dihapus.');
    }
}

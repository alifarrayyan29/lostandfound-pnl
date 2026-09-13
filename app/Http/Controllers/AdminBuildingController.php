<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;

class AdminBuildingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Buildings/Index', [
            'buildings' => Building::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        Building::create($request->all());
        return back()->with('success', 'Gedung berhasil ditambahkan.');
    }

    public function update(Request $request, Building $building)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $building->update($request->all());
        return back()->with('success', 'Gedung berhasil diperbarui.');
    }

    public function destroy(Building $building)
    {
        $building->delete();
        return back()->with('success', 'Gedung berhasil dihapus.');
    }
}

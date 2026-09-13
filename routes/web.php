<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $leaderboard = \App\Models\User::where('points', '>', 0)
        ->orderBy('points', 'desc')
        ->take(5)
        ->get();
        
    $recentReports = \App\Models\ItemReport::with(['building'])->latest()->take(4)->get();
        
    return Inertia::render('Dashboard', [
        'leaderboard' => $leaderboard,
        'recentReports' => $recentReports
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\ItemReportController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MessageController;
use App\Http\Middleware\AdminMiddleware;

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminBuildingController;

Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::patch('/claims/{claim}', [AdminController::class, 'updateClaimStatus'])->name('claims.update');
    
    Route::post('/qr/generate', [AdminController::class, 'generateQr'])->name('qr.generate');
    Route::get('/scan/{code}', [AdminController::class, 'scanQr'])->name('qr.scan');
    Route::post('/qr/handover', [AdminController::class, 'confirmHandover'])->name('qr.handover');
    
    Route::resource('categories', AdminCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('buildings', AdminBuildingController::class)->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('reports', ItemReportController::class);
    Route::resource('claims', ClaimController::class);
    
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/{user}', [MessageController::class, 'show'])->name('messages.show');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
});

require __DIR__.'/auth.php';

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
})->middleware(['auth'])->name('dashboard');

use App\Http\Controllers\ItemReportController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\QrHandoverController;
use App\Http\Middleware\AdminMiddleware;

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminBuildingController;

Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/verifications', [AdminController::class, 'verifications'])->name('verifications.index');
    Route::get('/history', [AdminController::class, 'history'])->name('history.index');
    Route::get('/recapitulation', [AdminController::class, 'recapitulation'])->name('recapitulation.index');
    Route::patch('/claims/{claim}', [AdminController::class, 'updateClaimStatus'])->name('claims.update');
    Route::patch('/reports/{report}/status', [AdminController::class, 'updateReportStatus'])->name('reports.updateStatus');

    Route::resource('categories', AdminCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('buildings', AdminBuildingController::class)->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('reports', ItemReportController::class);
    Route::patch('/reports/{report}/close', [ItemReportController::class, 'closeReport'])->name('reports.close');
    Route::resource('claims', ClaimController::class);
    
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/{user}', [MessageController::class, 'show'])->name('messages.show');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    
    Route::get('/scan/{code}', [QrHandoverController::class, 'scan'])->name('qr.scan');
    Route::post('/qr/handover', [QrHandoverController::class, 'confirmHandover'])->name('qr.handover');
    Route::post('/reports/{report}/generate-qr', [QrHandoverController::class, 'generate'])->name('qr.generate');
});

require __DIR__.'/auth.php';

<?php

use App\Http\Controllers\Api\CampusController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [CampusController::class, 'health']);
Route::post('/login', [CampusController::class, 'login']);
Route::post('/register', [CampusController::class, 'register']);
Route::get('/me', [CampusController::class, 'me']);
Route::post('/logout', [CampusController::class, 'logout']);

Route::get('/dashboard/{role}', [CampusController::class, 'dashboard']);
Route::match(['get', 'post'], '/reports', [CampusController::class, 'reports']);
Route::match(['get', 'patch', 'put'], '/reports/{code}', [CampusController::class, 'report']);
Route::get('/technicians', [CampusController::class, 'technicians']);
Route::get('/facilities', [CampusController::class, 'facilities']);
Route::get('/notifications', [CampusController::class, 'notifications']);
Route::get('/analytics', [CampusController::class, 'analytics']);
Route::get('/settings', [CampusController::class, 'settings']);

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\EtablissementController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| Routes publiques (sans authentification)
|--------------------------------------------------------------------------
*/

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Lister les établissements et filières (public)
Route::get('/etablissements', [EtablissementController::class, 'index']);
Route::get('/filieres', [FiliereController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Routes protégées (nécessitent un token)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Documents
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::put('/documents/{id}', [DocumentController::class, 'update']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    Route::post('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::post('/documents/{id}/rate', [DocumentController::class, 'rate']);
    
    // Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);



});
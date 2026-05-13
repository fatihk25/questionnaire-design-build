<?php

use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuestionnaireController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\RespondentController;
use App\Http\Controllers\Api\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

// API Routes
Route::prefix('api')->group(function () {
    // Public routes
    Route::get('/questions/{phase}', [QuestionController::class, 'getByPhase']);
    Route::get('/open-questions', [QuestionController::class, 'getOpenQuestions']);
    Route::post('/questionnaire/submit', [QuestionnaireController::class, 'submit']);
    Route::post('/respondents', [RespondentController::class, 'store']);
    
    // Admin routes
    Route::post('/admin/login', [AuthController::class, 'login']);
    
    Route::middleware(['auth'])->group(function () {
        Route::post('/admin/logout', [AuthController::class, 'logout']);
        
        // Admin functionality (Protected by Session)
        Route::get('/admin/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/admin/respondents', [RespondentController::class, 'index']);
        Route::get('/admin/respondents/{id}', [RespondentController::class, 'show']);
        Route::put('/admin/respondents/{id}', [RespondentController::class, 'update']);
        Route::delete('/admin/respondents/{id}', [RespondentController::class, 'destroy']);
        Route::get('/admin/risk-matrix/{phase}', [DashboardController::class, 'riskMatrix']);
        Route::get('/admin/average-scores/{phase}', [DashboardController::class, 'averageScores']);
        Route::delete('/admin/data/{phase}', [DashboardController::class, 'resetPhaseData']);
        
        // Export route placeholder
        Route::get('/admin/export/{phase}', function($phase) {
            return response()->json(['message' => 'Export not implemented yet'], 501);
        });
    });
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicHouseController;
use App\Http\Controllers\PublicReportController;

Route::get('/reports', [PublicReportController::class, 'index']);
Route::get('/reports/breakdown', [PublicReportController::class, 'breakdown']);

Route::get('/houses/{uuid}', [PublicHouseController::class, 'show']);

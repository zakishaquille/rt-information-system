<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('houses', \App\Http\Controllers\HouseController::class);

    Route::apiResource('residents', \App\Http\Controllers\ResidentController::class);
    Route::get('residents/{resident}/ktp', [\App\Http\Controllers\ResidentController::class, 'showKtp'])->name('residents.ktp');

    Route::post('houses/{house}/residents', [\App\Http\Controllers\HouseResidentController::class, 'store']);
    Route::delete('houses/{house}/residents/{resident}', [\App\Http\Controllers\HouseResidentController::class, 'destroy']);

    Route::get('due-type-rates', [\App\Http\Controllers\DueTypeRateController::class, 'index']);
    Route::post('due-type-rates', [\App\Http\Controllers\DueTypeRateController::class, 'store']);
    Route::delete('due-type-rates/{rate}', [\App\Http\Controllers\DueTypeRateController::class, 'destroy']);

    Route::get('payments/matrix', [\App\Http\Controllers\PaymentController::class, 'getMatrix']);
    Route::post('payments/annual', [\App\Http\Controllers\PaymentController::class, 'storeAnnual']);
    Route::post('payments', [\App\Http\Controllers\PaymentController::class, 'store']);
    Route::delete('payments/{payment}', [\App\Http\Controllers\PaymentController::class, 'destroy']);
    Route::apiResource('transactions', \App\Http\Controllers\TransactionController::class);

    Route::apiResource('transaction-categories', \App\Http\Controllers\TransactionCategoryController::class);
});

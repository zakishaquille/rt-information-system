<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicHouseController;

Route::get('/houses/{uuid}', [PublicHouseController::class, 'show']);

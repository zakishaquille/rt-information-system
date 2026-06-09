<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if ($request->password === env('ADMIN_PASSWORD')) {
            $user = User::firstOrCreate(
                ['email' => 'admin@rtis.local'],
                ['name' => 'Admin RT', 'password' => bcrypt(env('ADMIN_PASSWORD'))]
            );

            Auth::login($user);
            $request->session()->regenerate();

            return response()->json(['message' => 'Authenticated', 'user' => $user]);
        }

        return response()->json(['message' => 'Invalid password'], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom'              => 'required|string|max:255',
            'prenom'           => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|string|min:8|confirmed',
            'role'             => 'required|in:etudiant,professeur',
            'etablissement_id' => 'nullable|exists:etablissements,id',
            'filiere_id'       => 'nullable|exists:filieres,id',
            'niveau'           => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = \App\Models\User::create($validated);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load(['filiere', 'etablissement']),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load(['filiere', 'etablissement']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load(['filiere', 'etablissement']));
    }

    /**
     * Mettre à jour le profil
     * PUT /api/profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'prenom'           => 'sometimes|string|max:255',
            'nom'              => 'sometimes|string|max:255',
            'niveau'           => 'nullable|string',
            'telephone'        => 'nullable|string|max:20',
            'filiere_id'       => 'nullable|exists:filieres,id',
            'etablissement_id' => 'nullable|exists:etablissements,id',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user'    => $user->load(['filiere', 'etablissement']),
        ]);
    }

    /**
     * Mettre à jour la photo de profil
     * POST /api/profile/photo
     */
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $user = $request->user();

        // Supprimer l'ancienne photo si elle existe
        if ($user->profil_photo && Storage::disk('public')->exists($user->profil_photo)) {
            Storage::disk('public')->delete($user->profil_photo);
        }

        $file = $request->file('photo');
        $filename = 'avatars/' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('avatars', basename($filename), 'public');

        $user->update(['profil_photo' => $filename]);

        return response()->json([
            'message'      => 'Photo de profil mise à jour',
            'profil_photo' => asset('storage/' . $filename),
            'user'         => $user->load(['filiere', 'etablissement']),
        ]);
    }

    /**
     * Changer le mot de passe
     * PUT /api/password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password'      => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json(['message' => 'Mot de passe changé avec succès']);
    }
}
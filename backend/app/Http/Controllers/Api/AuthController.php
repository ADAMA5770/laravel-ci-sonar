<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        // Validation avec règles conditionnelles
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:etudiant,professeur',
            'etablissement_id' => [
                'nullable',
                Rule::exists('etablissements', 'id')->where(function ($query) {
                    // Optionnel : ajouter des conditions supplémentaires si besoin
                }),
            ],
            'filiere_id' => [
                'nullable', 
                Rule::exists('filieres', 'id')->where(function ($query) {
                    // Optionnel : ajouter des conditions supplémentaires si besoin
                }),
            ],
            'niveau' => 'nullable|string',
        ]);

        // Création de l'utilisateur
        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'etablissement_id' => $validated['etablissement_id'] ?? null,
            'filiere_id' => $validated['filiere_id'] ?? null,
            'niveau' => $validated['niveau'] ?? null,
        ]);

        // Création du token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner les infos utilisateur SANS le mot de passe
        return response()->json([
            'message' => 'Inscription réussie',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'etablissement_id' => $user->etablissement_id,
                'filiere_id' => $user->filiere_id,
                'niveau' => $user->niveau,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Connexion d'un utilisateur
     */
    public function login(Request $request)
    {
        // Validation
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Vérifier si l'utilisateur existe
        $user = User::where('email', $request->email)->first();

        // Vérifier le mot de passe
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Créer un token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner les infos utilisateur SANS le mot de passe
        return response()->json([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'etablissement_id' => $user->etablissement_id,
                'filiere_id' => $user->filiere_id,
                'niveau' => $user->niveau,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Déconnexion de l'utilisateur
     */
    public function logout(Request $request)
    {
        // Supprimer tous les tokens de l'utilisateur
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'etablissement_id' => $user->etablissement_id,
                'filiere_id' => $user->filiere_id,
                'niveau' => $user->niveau,
                'telephone' => $user->telephone,
                'profil_photo' => $user->profil_photo,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }
}
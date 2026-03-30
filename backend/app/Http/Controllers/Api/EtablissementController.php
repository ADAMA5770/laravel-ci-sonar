<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use Illuminate\Http\Request;

class EtablissementController extends Controller
{
    /**
     * Liste tous les établissements
     * GET /api/etablissements
     */
    public function index(Request $request)
    {
        $query = Etablissement::query();

        // Filtres optionnels
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('ville')) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }

        // Recherche par nom
        if ($request->has('search')) {
            $query->where('nom_etablissement', 'like', '%' . $request->search . '%');
        }

        // Inclure le nombre d'utilisateurs si demandé
        if ($request->has('with_users_count')) {
            $query->withCount('users');
        }

        $etablissements = $query->orderBy('nom_etablissement')->get();

        return response()->json($etablissements);
    }

    /**
     * Créer un nouvel établissement
     * POST /api/etablissements
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_etablissement' => 'required|string|max:255',
            'type' => 'required|in:CEM,Lycee,Universite',
            'ville' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $etablissement = Etablissement::create($validated);

        return response()->json([
            'message' => 'Établissement créé avec succès',
            'etablissement' => $etablissement,
        ], 201);
    }

    /**
     * Voir un établissement spécifique
     * GET /api/etablissements/{id}
     */
    public function show($id)
    {
        $etablissement = Etablissement::withCount('users')
            ->findOrFail($id);

        return response()->json($etablissement);
    }

    /**
     * Modifier un établissement
     * PUT /api/etablissements/{id}
     */
    public function update(Request $request, $id)
    {
        $etablissement = Etablissement::findOrFail($id);

        $validated = $request->validate([
            'nom_etablissement' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:CEM,Lycee,Universite',
            'ville' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $etablissement->update($validated);

        return response()->json([
            'message' => 'Établissement modifié avec succès',
            'etablissement' => $etablissement,
        ]);
    }

    /**
     * Supprimer un établissement
     * DELETE /api/etablissements/{id}
     */
    public function destroy($id)
    {
        $etablissement = Etablissement::findOrFail($id);

        // Vérifier s'il y a des utilisateurs liés
        if ($etablissement->users()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cet établissement car des utilisateurs y sont rattachés',
            ], 409); // Conflict
        }

        $etablissement->delete();

        return response()->json([
            'message' => 'Établissement supprimé avec succès',
        ]);
    }
}
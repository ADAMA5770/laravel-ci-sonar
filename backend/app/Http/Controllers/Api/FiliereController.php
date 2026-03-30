<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    /**
     * Liste toutes les filières
     * GET /api/filieres
     */
    public function index(Request $request)
    {
        $query = Filiere::query();

        // Recherche par nom
        if ($request->has('search')) {
            $query->where('nom_filiere', 'like', '%' . $request->search . '%');
        }

        // Inclure le nombre d'utilisateurs, documents, etc. si demandé
        if ($request->has('with_counts')) {
            $query->withCount(['users', 'documents', 'tutorielsVideos', 'annoncesCours']);
        }

        $filieres = $query->orderBy('nom_filiere')->get();

        return response()->json($filieres);
    }

    /**
     * Créer une nouvelle filière
     * POST /api/filieres
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_filiere' => 'required|string|max:255|unique:filieres,nom_filiere',
            'description' => 'nullable|string',
        ]);

        $filiere = Filiere::create($validated);

        return response()->json([
            'message' => 'Filière créée avec succès',
            'filiere' => $filiere,
        ], 201);
    }

    /**
     * Voir une filière spécifique
     * GET /api/filieres/{id}
     */
    public function show($id)
    {
        $filiere = Filiere::withCount(['users', 'documents', 'tutorielsVideos', 'annoncesCours'])
            ->findOrFail($id);

        return response()->json($filiere);
    }

    /**
     * Modifier une filière
     * PUT /api/filieres/{id}
     */
    public function update(Request $request, $id)
    {
        $filiere = Filiere::findOrFail($id);

        $validated = $request->validate([
            'nom_filiere' => 'sometimes|string|max:255|unique:filieres,nom_filiere,' . $id,
            'description' => 'nullable|string',
        ]);

        $filiere->update($validated);

        return response()->json([
            'message' => 'Filière modifiée avec succès',
            'filiere' => $filiere,
        ]);
    }

    /**
     * Supprimer une filière
     * DELETE /api/filieres/{id}
     */
    public function destroy($id)
    {
        $filiere = Filiere::findOrFail($id);

        // Vérifier s'il y a des données liées
        $hasUsers = $filiere->users()->count() > 0;
        $hasDocuments = $filiere->documents()->count() > 0;

        if ($hasUsers || $hasDocuments) {
            return response()->json([
                'message' => 'Impossible de supprimer cette filière car elle est utilisée',
            ], 409);
        }

        $filiere->delete();

        return response()->json([
            'message' => 'Filière supprimée avec succès',
        ]);
    }

    /**
     * Obtenir les documents d'une filière
     * GET /api/filieres/{id}/documents
     */
    public function documents($id)
    {
        $filiere = Filiere::findOrFail($id);
        
        $documents = $filiere->documents()
            ->with(['user', 'filiere'])
            ->withAvg('notes', 'note')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($documents);
    }

    /**
     * Obtenir les tutoriels vidéos d'une filière
     * GET /api/filieres/{id}/tutoriels
     */
    public function tutoriels($id)
    {
        $filiere = Filiere::findOrFail($id);
        
        $tutoriels = $filiere->tutorielsVideos()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tutoriels);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\NoteDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Liste tous les documents (avec filtres optionnels)
     * GET /api/documents?filiere_id=1&type_document=cours&niveau=L1
     */
    public function index(Request $request)
    {
        $query = Document::with(['user', 'filiere']);

        // Filtres optionnels
        if ($request->has('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }

        if ($request->has('type_document')) {
            $query->where('type_document', $request->type_document);
        }

        if ($request->has('niveau')) {
            $query->where('niveau', $request->niveau);
        }

        if ($request->has('annee')) {
            $query->where('annee', $request->annee);
        }

        // Recherche par titre
        if ($request->has('search')) {
            $query->where('titre', 'like', '%' . $request->search . '%');
        }

        // Tri par popularité (nombre de téléchargements) ou date
        $sort = $request->get('sort', 'recent'); // 'recent', 'popular', 'rated'
        
        if ($sort === 'popular') {
            $query->orderBy('nombre_telechargements', 'desc');
        } elseif ($sort === 'rated') {
            // Trier par moyenne des notes (nécessite une jointure)
            $query->withAvg('notes', 'note')->orderBy('notes_avg_note', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $documents = $query->paginate(15);

        return response()->json($documents);
    }

    /**
     * Créer un nouveau document (upload)
     * POST /api/documents
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type_document' => 'required|in:cours,TD,examen,corrige',
            'filiere_id' => 'required|exists:filieres,id',
            'niveau' => 'required|string',
            'annee' => 'required|string',
            'fichier' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        // Upload du fichier
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $filename = time() . '_' . Str::slug($validated['titre']) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('documents', $filename, 'public');
            $validated['fichier_url'] = $path;
        }

        // Ajouter l'ID de l'utilisateur connecté
        $validated['user_id'] = $request->user()->id;
        $validated['nombre_telechargements'] = 0;

        $document = Document::create($validated);

        return response()->json([
            'message' => 'Document créé avec succès',
            'document' => $document->load(['user', 'filiere']),
        ], 201);
    }

    /**
     * Voir un document spécifique
     * GET /api/documents/{id}
     */
    public function show($id)
    {
        $document = Document::with(['user', 'filiere', 'notes.user'])
            ->withAvg('notes', 'note')
            ->withCount('notes')
            ->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Modifier un document
     * PUT /api/documents/{id}
     */
    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        // Vérifier que l'utilisateur est le propriétaire
        if ($document->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à modifier ce document'
            ], 403);
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type_document' => 'sometimes|in:cours,TD,examen,corrige',
            'filiere_id' => 'sometimes|exists:filieres,id',
            'niveau' => 'sometimes|string',
            'annee' => 'sometimes|string',
            'fichier' => 'sometimes|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png|max:10240',
        ]);

        // Si un nouveau fichier est uploadé
        if ($request->hasFile('fichier')) {
            // Supprimer l'ancien fichier
            if ($document->fichier_url && Storage::disk('public')->exists($document->fichier_url)) {
                Storage::disk('public')->delete($document->fichier_url);
            }

            $file = $request->file('fichier');
            $filename = time() . '_' . Str::slug($validated['titre'] ?? $document->titre) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('documents', $filename, 'public');
            $validated['fichier_url'] = $path;
        }

        $document->update($validated);

        return response()->json([
            'message' => 'Document modifié avec succès',
            'document' => $document->load(['user', 'filiere']),
        ]);
    }

    /**
     * Supprimer un document
     * DELETE /api/documents/{id}
     */
    public function destroy(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        // Vérifier que l'utilisateur est le propriétaire
        if ($document->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce document'
            ], 403);
        }

        // Supprimer le fichier du stockage
        if ($document->fichier_url && Storage::disk('public')->exists($document->fichier_url)) {
            Storage::disk('public')->delete($document->fichier_url);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document supprimé avec succès'
        ]);
    }

    /**
     * Télécharger un document (incrémenter le compteur)
     * POST /api/documents/{id}/download
     */
    public function download($id)
    {
        $document = Document::findOrFail($id);

        // Incrémenter le compteur de téléchargements
        $document->increment('nombre_telechargements');

        return response()->json([
            'message' => 'Téléchargement enregistré',
            'fichier_url' => asset('storage/' . $document->fichier_url),
        ]);
    }

    /**
     * Noter un document
     * POST /api/documents/{id}/rate
     */
    public function rate(Request $request, $id)
    {
        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
        ]);

        $document = Document::findOrFail($id);

        // Vérifier si l'utilisateur a déjà noté ce document
        $existingNote = NoteDocument::where('user_id', $request->user()->id)
            ->where('document_id', $id)
            ->first();

        if ($existingNote) {
            // Mettre à jour la note existante
            $existingNote->update(['note' => $validated['note']]);
            $message = 'Note mise à jour avec succès';
        } else {
            // Créer une nouvelle note
            NoteDocument::create([
                'user_id' => $request->user()->id,
                'document_id' => $id,
                'note' => $validated['note'],
            ]);
            $message = 'Note ajoutée avec succès';
        }

        // Récupérer la moyenne des notes
        $moyenneNotes = $document->notes()->avg('note');

        return response()->json([
            'message' => $message,
            'moyenne_notes' => round($moyenneNotes, 1),
        ]);
    }
}
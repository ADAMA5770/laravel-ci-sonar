<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Liste toutes les conversations de l'utilisateur connecté
     * GET /api/conversations
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['user1', 'user2', 'lastMessage'])
            ->orderByDesc('updated_at')
            ->paginate(20);

        return response()->json($conversations);
    }

    /**
     * Messages d'une conversation spécifique
     * GET /api/conversations/{id}/messages
     */
    public function index($conversationId, Request $request)
    {
        $userId = $request->user()->id;

        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($q) use ($userId) {
                $q->where('user1_id', $userId)->orWhere('user2_id', $userId);
            })
            ->firstOrFail();

        $messages = Message::where('conversation_id', $conversationId)
            ->with('expediteur')
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Démarrer une nouvelle conversation
     * POST /api/conversations
     */
    public function startConversation(Request $request)
    {
        $validated = $request->validate([
            'email'   => 'required|email|exists:users,email',
            'contenu' => 'required|string|max:2000',
        ]);

        $currentUser = $request->user();
        $otherUser = User::where('email', $validated['email'])->first();

        if ($otherUser->id === $currentUser->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous envoyer un message.'], 422);
        }

        // Vérifier si une conversation existe déjà
        $existing = Conversation::where(function ($q) use ($currentUser, $otherUser) {
            $q->where('user1_id', $currentUser->id)->where('user2_id', $otherUser->id);
        })->orWhere(function ($q) use ($currentUser, $otherUser) {
            $q->where('user1_id', $otherUser->id)->where('user2_id', $currentUser->id);
        })->first();

        if ($existing) {
            // Envoyer le message dans la conversation existante
            Message::create([
                'conversation_id' => $existing->id,
                'expediteur_id'   => $currentUser->id,
                'contenu'         => $validated['contenu'],
            ]);
            $existing->touch();
            return response()->json([
                'conversation' => $existing->load(['user1', 'user2', 'lastMessage']),
            ], 200);
        }

        // Créer une nouvelle conversation
        $conversation = Conversation::create([
            'user1_id' => $currentUser->id,
            'user2_id' => $otherUser->id,
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'expediteur_id'   => $currentUser->id,
            'contenu'         => $validated['contenu'],
        ]);

        return response()->json([
            'conversation' => $conversation->load(['user1', 'user2', 'lastMessage']),
        ], 201);
    }

    /**
     * Envoyer un message dans une conversation existante
     * POST /api/messages
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'contenu'         => 'required|string|max:2000',
        ]);

        $userId = $request->user()->id;

        // Vérifier que l'utilisateur fait partie de la conversation
        $conversation = Conversation::where('id', $validated['conversation_id'])
            ->where(function ($q) use ($userId) {
                $q->where('user1_id', $userId)->orWhere('user2_id', $userId);
            })
            ->firstOrFail();

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'expediteur_id'   => $userId,
            'contenu'         => $validated['contenu'],
        ]);

        $conversation->touch();

        return response()->json([
            'message' => $message->load('expediteur'),
        ], 201);
    }
}
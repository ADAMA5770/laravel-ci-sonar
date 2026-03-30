<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Liste toutes les notifications de l'utilisateur connecté
     * GET /api/notifications
     */
    public function index(Request $request)
    {
        $query = Notification::where('user_id', $request->user()->id);

        // Filtrer par type si spécifié
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrer par statut lu/non lu
        if ($request->has('lu')) {
            $query->where('lu', $request->boolean('lu'));
        }

        // Ordre: non lues d'abord, puis par date
        $notifications = $query->orderBy('lu', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    /**
     * Récupérer le nombre de notifications non lues
     * GET /api/notifications/unread-count
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Marquer une notification comme lue
     * PUT /api/notifications/{id}/read
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->update(['lu' => true]);

        return response()->json([
            'message' => 'Notification marquée comme lue',
            'notification' => $notification,
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     * PUT /api/notifications/read-all
     */
    public function markAllAsRead(Request $request)
    {
        $updated = Notification::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues',
            'count' => $updated,
        ]);
    }

    /**
     * Marquer une notification comme non lue
     * PUT /api/notifications/{id}/unread
     */
    public function markAsUnread(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->update(['lu' => false]);

        return response()->json([
            'message' => 'Notification marquée comme non lue',
            'notification' => $notification,
        ]);
    }

    /**
     * Supprimer une notification
     * DELETE /api/notifications/{id}
     */
    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimée avec succès',
        ]);
    }

    /**
     * Supprimer toutes les notifications lues
     * DELETE /api/notifications/clear-read
     */
    public function clearRead(Request $request)
    {
        $deleted = Notification::where('user_id', $request->user()->id)
            ->where('lu', true)
            ->delete();

        return response()->json([
            'message' => 'Notifications lues supprimées',
            'count' => $deleted,
        ]);
    }

    /**
     * Créer une nouvelle notification (généralement appelé par d'autres controllers)
     * POST /api/notifications
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'contenu' => 'required|string',
            'type' => 'required|in:message,document,annonce',
        ]);

        $notification = Notification::create($validated);

        return response()->json([
            'message' => 'Notification créée avec succès',
            'notification' => $notification,
        ], 201);
    }
}
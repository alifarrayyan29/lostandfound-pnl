<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\User;
use App\Models\ItemReport;

class MessageController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        
        $messages = Message::with(['sender', 'receiver', 'itemReport'])
            ->where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->latest()
            ->get();
            
        $conversations = [];
        foreach ($messages as $msg) {
            $otherUser = $msg->sender_id === $userId ? $msg->receiver : $msg->sender;
            $report = $msg->itemReport;
            
            $reportId = $report ? $report->id : 0;
            $key = $otherUser->id . '_' . $reportId;
            
            if (!isset($conversations[$key])) {
                $conversations[$key] = [
                    'other_user' => $otherUser,
                    'report' => $report,
                    'last_message' => $msg,
                    'unread_count' => $msg->receiver_id === $userId && !$msg->is_read ? 1 : 0
                ];
            } else {
                if ($msg->receiver_id === $userId && !$msg->is_read) {
                    $conversations[$key]['unread_count']++;
                }
            }
        }

        return Inertia::render('Messages/Index', [
            'conversations' => array_values($conversations)
        ]);
    }

    public function show(User $user, Request $request)
    {
        $reportId = $request->query('report_id');
        $myId = auth()->id();
        
        $report = $reportId ? ItemReport::find($reportId) : null;

        Message::where('sender_id', $user->id)
            ->where('receiver_id', $myId)
            ->when($reportId, function($q) use ($reportId) {
                return $q->where('item_report_id', $reportId);
            })
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::with(['sender', 'receiver'])
            ->where(function($query) use ($myId, $user, $reportId) {
                $query->where(function($q) use ($myId, $user) {
                    $q->where('sender_id', $myId)->where('receiver_id', $user->id);
                })->orWhere(function($q) use ($myId, $user) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $myId);
                });
            })
            ->when($reportId, function($q) use ($reportId) {
                return $q->where('item_report_id', $reportId);
            })
            ->oldest()
            ->get();

        return Inertia::render('Messages/Show', [
            'otherUser' => $user,
            'report' => $report,
            'messages' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'item_report_id' => 'nullable|exists:item_reports,id',
            'content' => 'required|string|max:1000'
        ]);

        $validated['sender_id'] = auth()->id();
        Message::create($validated);

        return back();
    }
}

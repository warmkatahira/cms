<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WhiteboardUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int    $whiteboardId,
        public string $action,   // 'item.updated' 'staff.added' 'staff.deleted' 'staff.updated' 'zone.added' 'zone.deleted'
        public array  $payload,  // 各操作のデータ
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('whiteboard.' . $this->whiteboardId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'board.updated';
    }
}
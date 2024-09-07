<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Chat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public $message)
    {

    }

    /**
     * Create a new event instance.
     */
    public function broadcastOn()
    {
        return new Channel('chat_app'); // Channel name
    }

    /**
     * Get the name of the event to broadcast.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'chat'; // Event name
    }
}

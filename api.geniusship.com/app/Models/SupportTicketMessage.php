<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicketMessage extends Model
{
    use HasFactory;

    public $table = "support_tickets_messages";

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
    ];

    /**
     * Get the support ticket that this message belongs to.
     */
    public function supportTicket()
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }

    /**
     * Get the user that created this message.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

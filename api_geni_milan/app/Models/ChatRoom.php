<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    protected $fillable = ['customer_id', 'bidder_id', 'shipment_id', 'room_name'];
    use HasFactory;

    public function messages(){
        return $this->hasMany(ChatMessage::class,'chat_id')->with('user');
    }

}

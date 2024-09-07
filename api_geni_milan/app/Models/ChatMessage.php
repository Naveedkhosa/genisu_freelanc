<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ['message', 'user_id', 'chat_id', 'file_name'];
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class);
    }
}

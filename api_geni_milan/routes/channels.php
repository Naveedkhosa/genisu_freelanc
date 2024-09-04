<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    dd($user,$id);
    return (int) $user->id === (int) $id;
});



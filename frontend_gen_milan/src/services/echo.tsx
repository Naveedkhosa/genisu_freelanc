// src/services/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '0c8f331cd8ec4bccf03c',
    cluster: 'ap2',
    forceTLS: true,
});

export default echo;

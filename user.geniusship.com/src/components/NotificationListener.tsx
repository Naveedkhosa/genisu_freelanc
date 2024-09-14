import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Pusher from 'pusher-js';
import {app_url} from '@/services/apiClient';

interface Notification {
    id: number;
    message: string;
    timestamp: string;
    data: any;
}



const NotificationListener: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    const current_user = JSON.parse(localStorage.getItem("user"));

    if (current_user?.role === 'Driver' || current_user?.role === 'Transporter') {

        useEffect(() => {
            const pusher = new Pusher('64a0078618a01f0c0187', {
                cluster: 'ap2'
            });

            const channel = pusher.subscribe('driver-channel');
            channel.bind('notification', function (data: any) {
                const newNotification: Notification = {
                    id: Date.now(),
                    message: data.message,
                    timestamp: new Date().toLocaleString(),
                    data: data
                };
                setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

            });
        }, []);
    } else if (current_user?.role === 'Customer') {
        useEffect(() => {
            const pusher = new Pusher('64a0078618a01f0c0187', {
                cluster: 'ap2'
            });

            const channel = pusher.subscribe('user-channel');
            channel.bind('notification', function (data: any) {
                console.log("current user notification data received: " + data);
                if (data?.notification?.concernee == current_user?.id) {
                    const newNotification: Notification = {
                        id: Date.now(),
                        message: data?.notification?.message,
                        timestamp: new Date().toLocaleString(),
                        data: data?.notification
                    };
                    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
                }
            });
        }, []);
    }



    return (
        <Popover>
            <PopoverTrigger asChild>
                <Link to="#">
                    <span className="relative text-gray-600">
                        <FaBell className="text-lg text-gray-200" />
                        {notifications.length > 0 && (
                            <span className="absolute top-[-7px] right-[-7px] inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-600 rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </span>
                </Link>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-primary-200">
                <div className="grid gap-4 p-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none text-gray-300">Notifications</h4>
                        <p className="text-sm text-muted-foreground text-gray-300">
                            You have {notifications.length} new notification{notifications.length !== 1 && 's'}.
                        </p>
                    </div>
                    <div className=" h-[300px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="mb-2">
                                <p className="text-xs text-gray-300">{notification.timestamp}</p>
                                {(() => {
                                    if ('shiping_id' in notification?.data) {
                                        return (
                                            <Link to={`${app_url}my-request/${notification?.data?.shiping_id}`} className='text-gray-300'>{notification.message}</Link>
                                        )
                                    } else {
                                        return (
                                            <a href='#' className='text-gray-300'>{notification.message}</a>
                                        )
                                    }
                                })()}
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationListener;

























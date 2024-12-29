import { useState } from "react";
import { Bell, Calendar, Ship, MessageSquare } from "lucide-react";

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      description: 'Your yacht booking for July 15th has been confirmed.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from Captain Smith.',
      timestamp: '1 day ago',
      read: true,
    },
  ]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container py-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className={`text-primary ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

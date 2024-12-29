import { useState } from "react";
import { Bell, Calendar, Ship, MessageSquare, Gift, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNotifications, type NotificationType } from "@/hooks/use-notifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const { notifications, isLoading, markAsRead } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'promotion':
        return <Gift className="h-5 w-5" />;
      case 'reminder':
        return <Clock className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const filteredNotifications = notifications.filter(
    notification => selectedType === 'all' || notification.type === selectedType
  );

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  if (isLoading) {
    return (
      <div className="container py-4 space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as NotificationType | 'all')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="reminder">Reminders</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
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

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No notifications to display
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
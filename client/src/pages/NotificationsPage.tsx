import { useState, useEffect } from "react";
import { Bell, Calendar, Ship, MessageSquare, AlertTriangle, DollarSign, Tool, Cloud, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requestNotificationPermission } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'system' | 'payment' | 'maintenance' | 'weather' | 'service_update' | 'promotion' | 'emergency';
  category: 'transaction' | 'communication' | 'service' | 'safety' | 'marketing';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Request notification permission
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await requestNotificationPermission();
        toast({
          title: "Notifications enabled",
          description: "You will now receive push notifications",
        });
      } catch (error) {
        toast({
          title: "Notification permission denied",
          description: "You won't receive push notifications",
          variant: "destructive",
        });
      }
    };

    setupNotifications();
  }, [toast]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'payment':
        return <DollarSign className="h-5 w-5" />;
      case 'maintenance':
        return <Tool className="h-5 w-5" />;
      case 'weather':
        return <Cloud className="h-5 w-5" />;
      case 'service_update':
        return <Ship className="h-5 w-5" />;
      case 'promotion':
        return <Star className="h-5 w-5" />;
      case 'emergency':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const filteredNotifications = activeCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="transaction">Transactions</SelectItem>
              <SelectItem value="communication">Communications</SelectItem>
              <SelectItem value="service">Services</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-8 w-8 mb-4" />
                <p>No notifications in this category</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${!notification.read ? 'bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={`${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
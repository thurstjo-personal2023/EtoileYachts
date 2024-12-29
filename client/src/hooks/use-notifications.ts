import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';

export type NotificationType = 'booking' | 'message' | 'system' | 'promotion' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

export function useNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
  });

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to mark notification as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Firebase message listener
  useEffect(() => {
    const setupFirebase = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        // Send token to backend
        await fetch('/api/notifications/register-device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    };

    setupFirebase();

    const unsubscribe = onMessageListener().then((payload: any) => {
      toast({
        title: payload.notification.title,
        description: payload.notification.body,
      });
      // Refresh notifications
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [queryClient, toast]);

  return {
    notifications,
    isLoading,
    markAsRead,
    unreadCount: notifications.filter((n: Notification) => !n.read).length,
  };
}

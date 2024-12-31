import admin from 'firebase-admin';
import { db } from '@db';
import { notifications, users } from '@db/schema';
import { eq } from 'drizzle-orm';

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export interface SendNotificationParams {
  userId: number;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'payment' | 'maintenance' | 'weather';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export async function sendNotification({
  userId,
  title,
  message,
  type,
  priority = 'medium',
  metadata = {},
  scheduledFor,
  expiresAt,
}: SendNotificationParams) {
  try {
    // Get user's FCM token
    const [user] = await db
      .select({
        fcmToken: users.fcmToken,
        notificationPreferences: users.notificationPreferences,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user?.fcmToken || !user.notificationPreferences?.pushNotifications) {
      console.log(`Skip sending push notification for user ${userId}: No FCM token or push notifications disabled`);
      return null;
    }

    // Check quiet hours
    if (user.notificationPreferences.quiet_hours?.enabled) {
      const now = new Date();
      const { start, end, timezone } = user.notificationPreferences.quiet_hours;
      const isQuietHours = checkQuietHours(now, start, end, timezone);
      if (isQuietHours && priority !== 'urgent') {
        console.log(`Skip sending notification during quiet hours for user ${userId}`);
        return null;
      }
    }

    // Create notification record
    const [notification] = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        type,
        priority,
        metadata,
        scheduledFor,
        expiresAt,
      })
      .returning();

    // Prepare FCM message
    const fcmMessage = {
      notification: {
        title,
        body: message,
      },
      data: {
        notificationId: notification.id.toString(),
        type,
        ...metadata,
      },
      android: {
        priority: priority === 'urgent' ? 'high' : 'normal',
        notification: {
          channelId: type,
          icon: '@drawable/ic_notification',
          color: '#2196F3',
          priority: priority === 'urgent' ? 'max' : 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body: message,
            },
            sound: priority === 'urgent' ? 'critical.aiff' : 'default',
            badge: 1,
          },
        },
      },
      token: user.fcmToken,
    };

    // Send FCM message
    const fcmResponse = await admin.messaging().send(fcmMessage);

    // Update notification with FCM details
    await db
      .update(notifications)
      .set({
        fcmMessageId: fcmResponse,
        fcmStatus: 'sent',
        sentAt: new Date(),
      })
      .where(eq(notifications.id, notification.id));

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

function checkQuietHours(
  now: Date,
  start: string,
  end: string,
  timezone: string
): boolean {
  const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const hour = userTime.getHours();
  const minute = userTime.getMinutes();
  
  if (startHour < endHour) {
    return (hour > startHour || (hour === startHour && minute >= startMinute)) &&
           (hour < endHour || (hour === endHour && minute <= endMinute));
  } else {
    return (hour > startHour || (hour === startHour && minute >= startMinute)) ||
           (hour < endHour || (hour === endHour && minute <= endMinute));
  }
}

export const firebaseAdmin = admin;

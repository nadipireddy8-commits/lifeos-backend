import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { analyzeMessage } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Incoming Messages',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  // Listen to incoming notifications
  const subscription = Notifications.addNotificationReceivedListener(handleNotification);
  return subscription;
}

async function handleNotification(notification) {
  const messageBody = notification.request.content.body;
  if (messageBody && messageBody.length > 0) {
    // Auto-analyze emotion via backend
    try {
      await analyzeMessage(messageBody);
    } catch (err) {
      console.error('Failed to analyze message emotion', err);
    }
  }
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { startAutoActivityDetection } from './services/activityDetector';
import { registerForPushNotifications } from './services/notificationListener';

export default function App() {
  React.useEffect(() => {
    startAutoActivityDetection();
    registerForPushNotifications();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
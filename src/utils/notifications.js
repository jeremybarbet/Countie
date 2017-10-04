import PushNotification from 'react-native-push-notification';

const registerNotifications = () =>
  PushNotification.configure({
    // onNotification(notification) {},
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

export default registerNotifications;

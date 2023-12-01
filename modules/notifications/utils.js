import { Platform } from 'react-native';
import { getUniqueId, getAndroidId, getModel } from 'react-native-device-info';
import { registerDeviceInfoAPI } from './api';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

/**
 * Request and generate Firebase Messaging token and store it in the DB via REST API
 * @param  {String} authToken Backend API authentication token
 * @param  {String} userID User Backend identifier
 * @return {Promise}
 */

const getIosDeviceToken = () => {
  PushNotificationIOS.requestPermissions();
  const token = PushNotificationIOS.addEventListener('register', async token => {
    return token;
  });
  return token;
};
const RemotePushController = async (authToken, userID) => {
  const authStatus = await messaging().requestPermission();
  const ENABLED_STATUSES = [
    messaging.AuthorizationStatus.AUTHORIZED,
    messaging.AuthorizationStatus.PROVISIONAL,
  ];
  const isEnabled = ENABLED_STATUSES.includes(authStatus);
  // Checks if required permissions are allowed or not

  if (isEnabled) {
    const registrationToken = await messaging().getToken();
    const androidId = await getAndroidId();
    if (Platform.OS === 'android') {
      await registerDeviceInfoAPI(
        {
          user: userID,
          authToken: authToken,
          registration_id: registrationToken,
          type: Platform.OS,
          name: getModel(),
          active: true,
          device_id: androidId,
          cloud_message_type: 'FCM',
        },
        authToken
      );
    } else {
      PushNotificationIOS.requestPermissions();
      PushNotificationIOS.addEventListener('register', async token => {
        const iosId = await getUniqueId();
        await registerDeviceInfoAPI(
          {
            user: userID,
            authToken: authToken,
            registration_id: token,
            type: Platform.OS,
            name: getModel(),
            active: true,
            device_id: iosId,
            // cloud_message_type: 'FCM',
          },
          authToken
        );
      });
    }
    // API which registers the device details and FCM token in backend
  }
  messaging().onNotificationOpenedApp(remoteMessage => {});
};

export default RemotePushController;

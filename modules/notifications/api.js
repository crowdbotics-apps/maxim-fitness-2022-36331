import { Platform } from 'react-native';
import { API_URL } from '../../src/config/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const global = getGlobalOptions();
// Change your BASE_URL in `options/options.js` to edit this value
const BASE_URL = API_URL.replace(/\/api\/v1/, '');

export const registerDeviceInfoAPI = async (data, authToken) => {
  const response = await fetch(`${BASE_URL}/modules/fcm/user_fcm_device_add/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'token ' + authToken,
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  const res = await response.json();
  return res;
};

export const fetchNotifications = async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  const response = await fetch(`${BASE_URL}/modules/fcm/notification/`, {
    method: 'GET',
    headers: {
      Authorization: 'token ' + authToken,
    },
  });
  const res = await response.json();
  return res;
};

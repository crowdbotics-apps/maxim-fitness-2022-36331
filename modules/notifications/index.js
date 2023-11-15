import React, { useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native';
import Notifications from './flatlist';

const PushNotifications = () => {
  // const { authToken, userID, styles } = options;

  useEffect(() => {
    // RemotePushController(authToken, userID);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Notifications />
    </SafeAreaView>
  );
};

export default {
  title: 'Push Notifications',
  navigator: PushNotifications,
};

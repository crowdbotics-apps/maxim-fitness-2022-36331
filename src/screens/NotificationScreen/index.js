import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Layout, Gutters } from '../../theme';
import Notifications from '../../../modules/notifications/flatlist';
import CustomHeader from '../../components/CustomHeader';

const NotificationScreen = ({ navigation }) => {
  const { fill } = Layout;

  return (
    <SafeAreaView style={[fill]}>
      <CustomHeader header="Notification" navigation={navigation} />
      <Notifications navigation={navigation} />
    </SafeAreaView>
  );
};
export default NotificationScreen;

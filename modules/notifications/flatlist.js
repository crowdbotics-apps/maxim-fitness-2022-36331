import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import options from './options';
import { fetchNotifications } from './api';

const Notifications = () => {
  const { styles, dummyImageLink } = options;
  // Contains the messages recieved from backend
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotifications = async () => {
    setLoading(true);
    // Api to fetch recent list of notifications
    const res = await fetchNotifications();
    setMessages(res);
    setLoading(false);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  /**
   * Notification component that will be rendered in Flatlist
   * @param  {Object} item Object containing Notification details
   * @return {React.ReactNode}
   */
  const renderItem = ({ item }) => {
    const date = item?.created;
    const arr = date.split('T');
    const time = arr[1].split('.');
    return (
      <View style={styles.walletCard}>
        <View style={styles.walletInner}>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri: item?.image || dummyImageLink,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.walletCarder}>
            <Text style={styles.eventName}>{item?.title}</Text>
            <Text style={styles.eventType}>{item?.message}</Text>
          </View>
        </View>
        <View style={styles.leftSection}>
          <Text style={styles.view}>Date: {arr[0]}</Text>
          <Text style={styles.reject}>Time: {time[0]}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator color={'gray'} size="large" />
        </View>
      ) : messages?.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onRefresh={getNotifications}
          refreshing={loading}
        />
      ) : (
        <View style={styles.loaderStyle}>
          <Text style={{ fontSize: 18 }}>No record found</Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;

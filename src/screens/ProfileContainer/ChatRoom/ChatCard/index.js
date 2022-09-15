import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from './styles';

const ChatCard = props => {
  const { userName } = props.chat.secondaryUser;
  const { message, messageType, unReadMessagesCount } = props.chat;
  let isImage = messageType === 'image';

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => props.chatTapped()}>
      <View style={styles.imageView} />
      <View style={styles.messageView}>
        <Text style={styles.nameText} numberOfLines={1}>
          {userName}
        </Text>
        <Text style={styles.messageText} numberOfLines={3}>
          {isImage ? (
            <View style={styles.photoView}>
              <Text style={styles.photoText}>Photo</Text>
            </View>
          ) : (
            <Text> {message}</Text>
          )}
        </Text>
      </View>

      <View style={styles.timestampView}>
        {unReadMessagesCount > 0 && (
          <View style={styles.countView}>
            <Text style={styles.countText}>{unReadMessagesCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;

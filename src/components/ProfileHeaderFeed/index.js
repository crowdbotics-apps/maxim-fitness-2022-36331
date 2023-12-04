import React from 'react'
import { View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const ProfileHeaderFeed = ({ imageUrl, onAvatarChange, style }) => {
  return (
    <View style={[styles.profileWrapper, style]}>
      <TouchableWithoutFeedback onPress={onAvatarChange}>
        <View style={styles.profileImageContainer}>
          <Image source={imageUrl} style={styles.profileImage} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 50,
    height: 50,
    // borderWidth: 1,
    borderRadius: 25,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    resizeMode: 'cover'
  },
  profileWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default ProfileHeaderFeed;

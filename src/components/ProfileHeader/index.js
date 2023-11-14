import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Text from '../Text';
import { Images } from 'src/theme';

const ProfileHeader = props => {
  const { source, userName, time, content } = props;
  return (
    <View style={styles.cardHeader}>
      <Image source={source} style={styles.profileImg} />
      <View style={{ flex: 1 }}>
        <View style={styles.profileSection}>
          <Text text={userName} style={styles.nameText} />
          <Text text={time} style={styles.timeText} />
        </View>
        <Text text={content} style={styles.pageText} />
      </View>
      {/* <Image source={Images.etc} style={styles.profileImg} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  nameText: {
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 10,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: 'bold',
  },
  pageText: {
    fontSize: 12,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

export default ProfileHeader;

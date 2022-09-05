import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Images, Colors} from 'src/theme';
import ProfileHeaderFeed from '../ProfileHeaderFeed';

const Header = ({imageUrl, onAvatarChange, item, index}) => {

  return (
    <View style={styles.mainContainer}>
      <View style={styles.currentTabStyle}>
        <ProfileHeaderFeed
          imageUrl={imageUrl}
          onAvatarChange={onAvatarChange}
          style={styles.profileStyle}
        />
      </View>
      <View style={styles.currentTab}>
        <TouchableOpacity style={styles.iconStyle}>
          <Image source={Images.searchIcon} style={{width: 25, height: 25, marginRight: 20, resizeMode: 'contain'}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle}>
          <Image source={Images.addIcon} style={{width: 25, height: 25, resizeMode: 'contain'}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  profileStyle: {
    borderRadius: 100
  },
  currentTabStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  currentTabText: {
    fontSize: 18,
    paddingVertical: 5,
    color: Colors.black,
    fontWeight: 'bold',
  },
  currentTab: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  iconStyle: {alignItems: 'center', justifyContent: 'center'}
})

export default Header;

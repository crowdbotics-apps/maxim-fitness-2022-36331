import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Text from '../Text';
import {Images, Layout, Global, Gutters, Colors} from 'src/theme';
import {calculatePostTime} from 'src/utils/functions';
import ProfileHeaderFeed from '../ProfileHeaderFeed';
import {Icon} from 'native-base'

const Header = () => {

  return (
    <View style={styles.mainContainer}>

      <View style={styles.currentTabStyle}>
        <ProfileHeaderFeed
          imageUrl={Images.profile}
          // onAvatarChange={onAvatarChange}
          style={styles.profileStyle}
        />
        {/* <Text style={styles.currentTabText} text="Posts" /> */}
      </View>
      <View style={styles.currentTab}>
        <TouchableOpacity style={styles.iconStyle}>
          <Image source={Images.searchIcon} style={{width: 20, height: 20, marginRight: 20}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle}>
          <Image source={Images.addIcon} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    // height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 3,
    // borderColor: Colors.alto,
    paddingHorizontal: 15,
    // marginTop: 10,
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

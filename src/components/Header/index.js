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
          imageUrl={Images.home}
          // onAvatarChange={onAvatarChange}
          style={styles.profileStyle}
        />
        {/* <Text style={styles.currentTabText} text="Posts" /> */}
      </View>
      <View style={styles.currentTab}>
        <TouchableOpacity style={styles.iconStyle}>
          <Icon type="MaterialIcons" name="search" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle}>
          {/* <Icon type="MaterialIcons" name="add" /> */}

          <Icon type='FontAwesome5' name='plus' />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    borderBottomWidth: 3,
    borderColor: Colors.alto,
    paddingHorizontal: 15,
    marginTop: 10
  },
  profileStyle: {backgroundColor: 'yellow', borderRadius: 100},
  currentTabStyle: {
    backgroundColor: 'blue',
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
  currentTab: {flexDirection: 'row', backgroundColor: 'pink', flex: 1, justifyContent: 'flex-end'}
})

export default Header;

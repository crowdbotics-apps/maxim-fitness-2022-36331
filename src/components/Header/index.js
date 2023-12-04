import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Images } from 'src/theme'

const Header = ({ imageUrl, onAvatarChange, onPressPlus, onPressSearch }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.currentTabStyle}>
        <TouchableWithoutFeedback onPress={onAvatarChange}>
          <Image source={imageUrl} style={styles.profileImage} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.currentTab}>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressSearch}>
          <Image source={Images.searchIcon} style={styles.searchImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressPlus}>
          <Image source={Images.addIcon} style={styles.addImage} />
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
  currentTabStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  currentTab: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  iconStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchImage: {
    width: 25,
    height: 25,
    marginRight: 20,
    resizeMode: 'contain'
  },
  addImage: {
    width: 30,
    height: 30
  },
  profileImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'gray'
  },
})

export default Header;

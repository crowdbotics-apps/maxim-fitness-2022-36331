import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Images, Layout, Gutters } from '../../theme';

const HeaderForDrawer = ({ onDrawerButtonPress, headerNavProp, hideHamburger = true }) => {
  const { row, fill, center, fullWidth, alignItemsCenter } = Layout;
  const { smallHPadding, smallTPadding } = Gutters;
  return (
    <View
      style={[
        row,
        smallHPadding,
        smallTPadding,
        alignItemsCenter,
        fullWidth,
        styles.headerNav,
        headerNavProp,
      ]}
    >
      <View style={fill}>
        {!hideHamburger ? (
          <TouchableOpacity onPress={() => onDrawerButtonPress()}>
            <Image style={styles.imageWrapper} source={Images.iconBurger} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[fill, center]}>
        <Image style={styles.imageWrapperSecond} source={Images.splashLogo} />
      </View>
      <View style={fill} />
    </View>
  );
};
const styles = StyleSheet.create({
  headerNav: {
    paddingBottom: 25,
  },
  imageWrapper: {
    width: 30,
    height: 30,
  },
  imageWrapperSecond: {
    width: 100,
    height: 30,
    resizeMode: 'cover',
  },
});
export default HeaderForDrawer;

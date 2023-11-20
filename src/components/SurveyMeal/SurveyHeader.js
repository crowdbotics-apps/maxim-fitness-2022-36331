import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Images } from '../../theme';

const SurveyHeader = props => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.arrowContainer} onPress={props.onArrowPress}>
      <Image style={styles.arrow} source={Images.backIcon} resizeMode="contain" />
    </TouchableOpacity>
    <View>{/* <Image style={styles.logo} source={Logo} resizeMode="cover" /> */}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    width: '100%',
  },
  arrowContainer: {
    position: 'absolute',
    left: 20,
    top: 17,
  },
  arrow: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  logo: {
    width: 150,
    height: 40,
  },
});

export default SurveyHeader;

/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import {Colors} from './Variables';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  transparentBg: {
    backgroundColor: 'transparent',
  },
  primary: {
    color: Colors.white,
  },
  primaryBg: {
    backgroundColor: Colors.primary,
  },
  secondaryBg: {
    backgroundColor: Colors.white,
  },
  turtiary: {
    color: Colors.athensgray,
  },
  turtiaryBg: {
    backgroundColor: Colors.athensgray,
  },
  altoBg: {
    backgroundColor: Colors.alto,
  },
  punchBg: {
    backgroundColor: Colors.punch,
  },
  blackOpacityBg: {
    backgroundColor: 'rgb(214,214,214)',
  },
  halfOpacityBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
  },
  border: {
    borderWidth: 1,
  },
  borderColor: {
    borderColor: Colors.white,
  },
  borderB: {
    borderBottomWidth: 1,
  },
  borderT: {
    borderTopWidth: 1,
  },
  borderR10: {
    borderRadius: 10,
  },
  borderR30: {
    borderRadius: 30,
  },
  borderAlto: {
    borderColor: Colors.alto,
  },
  borderNobel: {
    borderColor: Colors.nobel,
  },
  topLRBorderRadius20: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  height40: {
    height: 40,
  },
});

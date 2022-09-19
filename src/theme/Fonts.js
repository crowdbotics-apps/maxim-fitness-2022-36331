/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'
import { FontSize } from './Variables'

export default StyleSheet.create({
  textSmall: {
    fontSize: FontSize.small, // 10
    lineHeight: 12,
  },
  textRegular: {
    fontSize: FontSize.regular, // 12
    lineHeight: 14
  },
  textMedium: {
    fontSize: FontSize.medium, // 16
    lineHeight: 18,
  },
  textLarge: {
    fontSize: FontSize.large, // 18
    lineHeight: 20
  },
  titleSmall: {
    fontSize: FontSize.small * 2, // 20
    lineHeight: 22
  },
  titleRegular: {
    fontSize: FontSize.regular * 2, // 24
    lineHeight: 26,
  },
  titleMedium: {
    fontSize: FontSize.regular * 2 + 4, // 28
    lineHeight: 30,
  },
  titleLarge: {
    fontSize: FontSize.large * 2, // 36
    lineHeight: 38
  },
  titleXLarge: {
    fontSize: FontSize.small * 4, // 40
    lineHeight: 42
  },
  textCenter: {
    textAlign: 'center'
  },
  textJustify: {
    textAlign: 'justify'
  },
  textLeft: {
    textAlign: 'left'
  },
  textRight: {
    textAlign: 'right'
  },
  textUnderline: {
    textDecorationLine: 'underline'
  },
});

import React from "react"
import { Text as NBText } from "react-native"

// styles
import styles from "./styles"
import { Fonts } from "src/theme"

const Text = ({
  text,
  center,
  end,
  start,
  style,
  color,
  bold,
  underlined,
  numberOfLines,
  onPress,
  children,
  small,
  regular,
  medium,
  large,
  smallTitle,
  regularTitle,
  largeTitle
}) => {
  const {
    textCenter,
    textLeft,
    textRight,
    textRegular,
    textSmall,
    textMedium,
    textLarge,
    titleLarge,
    titleSmall,
    titleRegular,
    textUnderline
  } = Fonts

  return (
    <NBText
      onPress={onPress}
      style={[
        underlined && textUnderline,
        start && textLeft,
        center && textCenter,
        end && textRight,
        bold && styles.boldFont,
        color && styles[color],
        small && textSmall,
        regular && textRegular,
        medium && textMedium,
        large && textLarge,
        smallTitle && titleSmall,
        regularTitle && titleRegular,
        largeTitle && titleLarge,
        style
      ]}
      numberOfLines={numberOfLines && numberOfLines}
    >
      {text ? text : children}
    </NBText>
  )
}

export default Text

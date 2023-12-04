import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../theme';

const FatGradientIconButton = ({
  buttonIcon,
  buttonText,
  onPress,
  colorsGradient,
  colorsGradientDisable,
  buttonContainerStyleProp,
  disabled,
}) => (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    colors={!disabled ? colorsGradient : colorsGradientDisable}
    style={[styles.buttonContainer, buttonContainerStyleProp]}
  >
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress} disabled={disabled}>
      <View style={styles.iconContainer}>
        <Image source={buttonIcon || Images.iconDone} style={styles.iconStyle} />
      </View>
      <View style={styles.buttonText}>
        <Text style={styles.buttonLabelStyle}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: { width: 40, height: 40 },
  buttonText: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabelStyle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FatGradientIconButton;

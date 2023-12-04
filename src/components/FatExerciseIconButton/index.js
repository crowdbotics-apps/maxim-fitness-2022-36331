import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import { Images } from '../../theme';

const FatExerciseIconButton = ({ buttonIcon, buttonText, onPress, disabled }) => (
  <TouchableOpacity style={styles.buttonContainer} onPress={onPress} disabled={disabled}>
    <View style={styles.iconContainer}>
      <Image source={buttonIcon || Images.iconDone} style={styles.iconStyle} />
    </View>
    <View style={styles.buttonText}>
      <Text style={styles.buttonLabelStyle}>{buttonText}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(242, 242, 242)',
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
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FatExerciseIconButton;

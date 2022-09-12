import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Images } from '../../theme'

const SetButton = ({ onClick, setStyle }) => (
  <View style={[styles.scrollContainer, setStyle]}>
    <TouchableOpacity
      disabled
      style={[
        styles.buttonContainer,
        {
          backgroundColor: '#DBD7D2',
        },
      ]}
      onPress={onClick}
    >
      {false && (
        <View style={styles.iconContainer}>
          <Image source={Images.iconDoneProgram} style={styles.iconStyle} />
        </View>
      )}
      <View style={styles.buttonText}>
        <Text>{`Set`}</Text>
      </View>
      {false && (
        <View style={styles.iconContainer}>
          <View style={styles.iconStyle} />
        </View>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginRight: 5,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgb(242, 242, 242)',
    borderRadius: 10,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: { width: 20, height: 20 },
  buttonText: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SetButton;

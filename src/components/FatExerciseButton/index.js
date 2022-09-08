import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FatExerciseButton = ({ buttonLabel, onClick, loading, individualSets, changeCol }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => onClick()}>
      {loading ? (
        <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
      ) : (
        <View style={styles.iconContainer}>
          <Text
            style={[
              styles.styleButtonText,
              { color: individualSets?.done === true || changeCol === true ? 'black' : '#D3D3D3' },
            ]}
          >
            {individualSets?.reps || 0}
          </Text>
        </View>
      )}
      <View style={styles.separator} />
      <View style={styles.buttonTextStyle}>
        <Text style={styles.buttonLabelStyle}>{buttonLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  separator: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    width: 50,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 20,
    backgroundColor: 'rgb(242, 242, 242)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleButtonText: {
    fontSize: 26,
    fontWeight: '800',
  },
  buttonLabelStyle: {
    color: 'black',
    fontSize: 14,
  },
});

export default FatExerciseButton;

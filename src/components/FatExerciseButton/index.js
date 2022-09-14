import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import Text from '../Text'

const FatExerciseButton = ({
  buttonLabel,
  onPress,
  loadingReps,
  loadingWeight,
  text,
  repsColor,
  weightColor,
  reps,
  weight,
  repsWeightState,
  disabled
}) => {
  return (
    <>
      {reps ? (
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress} disabled={disabled}>
          {loadingReps ? (
            <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
          ) : (
            <View style={styles.iconContainer}>
              <Text
                style={[styles.styleButtonText, { color: repsColor ? 'black' : '#D3D3D3' }]}
                text={text ? text : '0'}
              />
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.buttonTextStyle}>
            <Text style={styles.buttonLabelStyle}>{buttonLabel}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      {weight ? (
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress} disabled={disabled}>
          {loadingWeight ? (
            <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
          ) : repsWeightState.weight !== '0' ? (
            <>
              <View style={styles.iconContainer}>
                <Text
                  style={[
                    styles.styleButtonText,
                    {
                      color: weightColor ? 'black' : '#D3D3D3',
                    },
                  ]}
                  text={text ? text : '0'}
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.buttonTextStyle}>
                <Text style={styles.buttonLabelStyle}>{buttonLabel}</Text>
              </View>
            </>
          ) : (
            <View style={styles.iconContainer2}>
              <Text style={styles.styleButtonText2}>{'Enter Weight Used'}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </>
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
  iconContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 80,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  styleButtonText2: {
    fontSize: 16,
    color: '#D3D3D3',
    fontWeight: '800',
    textAlign: 'center',
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

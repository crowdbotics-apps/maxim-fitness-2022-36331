import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FatExerciseButtonWeight = ({ individualSets, onClick, loading, changeColor, buttonLabel }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => onClick()}>
      {loading ? (
        <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
      ) : true ? (
        <>
          <View style={styles.iconContainer2}>
            <Text
              style={[
                styles.styleButtonText,
                {
                  color: individualSets?.done === true || changeColor === true ? 'black' : '#D3D3D3',
                },
              ]}
            >
              {0}
            </Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.buttonTextStyle}>
            <Text style={styles.buttonLabelStyle}>{buttonLabel}</Text>
          </View>
        </>
      ) : (
        <View style={styles.iconContainer}>
          <Text style={styles.styleButtonText2}>{'Enter Weight Used'}</Text>
        </View>
      )}
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
  iconContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 80,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  styleButtonText: {
    fontSize: 26,
    fontWeight: '800',
  },
  styleButtonText2: {
    fontSize: 16,
    color: '#D3D3D3',
    fontWeight: '800',
    textAlign: 'center',
  },
  styleButtonText1: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default FatExerciseButtonWeight;

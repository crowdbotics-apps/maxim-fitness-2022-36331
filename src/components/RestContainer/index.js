import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Timer from '../Timer';

const RestContainer = ({ onPress, showBar, loading, isDisable, increment }) => {
  const widthProgress = Dimensions.get('screen').width;

  return (
    <View style={styles.mainContainer}>
      {showBar && (
        <View style={styles.showBarContainer}>
          <View style={styles.showBarText}>
            <Text style={styles.showBarTextStyle}>Rest:</Text>
            <View>
              <Timer until={90} />
            </View>
          </View>
          <Progress.Bar
            progress={increment}
            height={25}
            width={widthProgress - 40}
            borderRadius={10}
            style={{ transform: [{ scaleX: -1 }] }}
            color={'#fff'}
            unfilledColor={'#3180BD'}
            borderColor={'#3180BD'}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisable}
        style={[styles.buttonStyle, { backgroundColor: isDisable ? '#838383' : '#db3b26' }]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
        ) : (
          <Text style={styles.buttonText}>Finish Workout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginTop: 20, marginHorizontal: 20 },
  showBarContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  showBarText: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    position: 'absolute',
    left: 0,
    zIndex: 2,
    height: 20,
    marginTop: 2,
  },
  showBarTextStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonStyle: {
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold', textAlign: 'center' },
})

export default RestContainer;

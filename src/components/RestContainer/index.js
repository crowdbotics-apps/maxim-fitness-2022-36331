import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import Timer from '../Timer';

const RestContainer = ({
  startCount,
  restContainerStyleProp,
  secondsRest,
  stopCountFunc,
  activeSet,
  startRest,
  NextScreen,
  showBar,
  loading,
  isDisable,
}) => {
  const widthProgress = Dimensions.get('screen').width;
  const [seconds, setSeconds] = useState('');
  const [intervalRef, setIntervalRef] = useState(null);
  const [increment, setIncrement] = useState(0);

  // useEffect(() => {
  //   if (!seconds) {
  //     setSeconds(activeSet?.timer);
  //   }
  // }, [secondsRest, startCount, activeSet, seconds]);

  // useInterval(
  //   () => {
  //     if (seconds > 0 && startCount) {
  //       setSeconds(seconds - 1);
  //     } else {
  //       stopCountFunc(setSeconds);
  //       if (seconds === 0) {
  //         clearInterval(intervalRef);
  //       }
  //     }
  //   },
  //   1000,
  //   setIntervalRef,
  //   startCount
  // );

  // useEffect(() => {
  //   if (startRest) {
  //     setTimeout(() => {
  //       setIncrement(increment + 1 / 90);
  //     }, 1000);
  //   } else {
  //     setIncrement(0);
  //   }
  // }, [increment, startRest]);

  return (
    <View style={{ marginTop: 20, marginHorizontal: 20 }}>
      {showBar && (
        <View
          style={{
            marginVertical: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          <View
            style={{
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
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 15,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Rest:
            </Text>
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
        onPress={NextScreen}
        style={[
          restContainerStyleProp,
          {
            backgroundColor: !isDisable ? '#838383' : '#db3b26',
            borderRadius: 10,
            height: 40,
            paddingHorizontal: 10,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          },
        ]}
        disabled={!isDisable}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
        ) : (
          <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            Finish Workout
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

function useInterval(callback, delay, setIntervalRef, startCount) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (startCount) {
      let id = setInterval(tick, delay);
      setIntervalRef(id);
      return () => clearInterval(id);
    }
  }, [delay, setIntervalRef, startCount]);
}

export default RestContainer;

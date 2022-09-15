import React, { useEffect, useState } from 'react';
import Text from '../Text';
import { View } from 'react-native';

const StaticTimer = ({
  startTimer,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  hours,
  setHours
}) => {

  useEffect(() => {
    if (!startTimer) {
      const myInterval = setInterval(() => {
        if (seconds >= 0) {
          if (minutes === 60) {
            setMinutes(0);
            setHours(prevState => prevState + 1);
          } else {
            if (seconds === 60) {
              setSeconds(0);
              setMinutes(prevState => prevState + 1);
            } else {
              setSeconds(prevState => prevState + 1);
            }
          }
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    } else {
      clearInterval();
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  }, [seconds, minutes, hours]);

  return (
    <View>
      <Text
        color="quinary"
        text={`${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds
          }`}
        medium
        bold
      />
    </View>
  );
};

export default StaticTimer;

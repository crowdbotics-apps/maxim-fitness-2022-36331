import React, {useEffect, useState} from 'react';
import {Text} from '../index';
import {View} from 'react-native';

const StaticTimer = ({startTimer}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  useEffect(() => {
    if (!startTimer) {
      const myInterval = setInterval(() => {
        if (seconds >= 0) {
          if (minutes === 60) {
            setMinutes(0);
            setHours(hours + 1);
          } else {
            if (seconds === 60) {
              setSeconds(0);
              setMinutes(minutes + 1);
            } else {
              setSeconds(seconds + 1);
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
        text={`${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${
          seconds < 10 ? '0' + seconds : seconds
        }`}
        medium
        bold
      />
    </View>
  );
};

export default StaticTimer;

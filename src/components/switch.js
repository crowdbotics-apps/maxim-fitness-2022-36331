import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

export const Switch = ({ value, onSwitch }) => {
  return (
    <TouchableOpacity onPress={() => onSwitch(!value)}>
      {value ? (
        <Image source={require("assets/images/switch-on.png")} />
      ) : (
        <Image source={require("assets/images/switch-off.png")} />
      )}
    </TouchableOpacity>
  );
};

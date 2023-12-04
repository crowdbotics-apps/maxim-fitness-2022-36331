import React from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Text from '../Text';
import InputField from '../InputField';
import { Layout, Global } from '../../theme';

const ModalInput = props => {
  const { text, value, onChangeText, placeholder, keyboardType } = props;
  const { row, fill, alignItemsCenter, justifyContentBetween } = Layout;
  const { border, height40, borderR10, borderAlto } = Global;

  return (
    <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
      <View style={[fill, row, justifyContentBetween]}>
        <View style={[fill, row, height40, alignItemsCenter]}>
          <Text text={text} color="septenary" bold center medium />
        </View>
        <InputField
          inputStyle={[fill, row, border, borderAlto, height40, borderR10]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize="none"
          keyboardType={keyboardType}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ModalInput;

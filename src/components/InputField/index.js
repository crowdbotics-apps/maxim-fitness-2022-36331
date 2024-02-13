import React from "react"
import { View, StyleSheet, TextInput } from "react-native"
import { Colors } from "../../theme"

const InputField = ({
  value,
  onChangeText,
  secureTextEntry,
  maxLength,
  inputStyle,
  placeholder,
  placeholderTextColor,
  keyboardType
}) => {
  return (
    <TextInput
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[styles.textInput, inputStyle]}
      placeholderTextColor={placeholderTextColor || "#5e5e5e"}
    />
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.black,
    borderColor: Colors.steel,
    paddingHorizontal: 10
  }
})

export default InputField

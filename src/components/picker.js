import { StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather'
import React from 'react'
import { Box } from './box';
import { Text } from './text';
import { typography } from 'utils';

export const Picker = ({ label, value, placeholder, options, onChange, error, textColor = 'text' }) => {
  return (
    <Box style={pickerSelectStyles.container}>
      <Text variant='label' color={textColor} style={pickerSelectStyles.label}>{label}</Text>
      <RNPickerSelect
        value={value}
        placeholder={placeholder}
        textInputProps={{
          placeholder: placeholder
        }}
        onValueChange={(value) => onChange(value)}
        style={pickerSelectStyles}
        Icon={Platform.select({
          ios: () => <Feather
            name="chevron-down"
            size={24}
            color="#9D9AAD"
          />
        })}
        items={options ?? []}
      />
      {!!error && <Text color="error">{error}</Text>}
    </Box>
  )
}


const pickerSelectStyles = StyleSheet.create({
  container: {
  },
  label: {
    fontWeight: '700',
    marginBottom: 10,
  },
  inputIOS: {
    fontSize: 16,
    padding: 12,
    paddingLeft: 24,
    backgroundColor: '#ffff',
    borderRadius: 16,
    color: '#605E70',
    height: 55,
    paddingRight: 30,
    fontFamily: typography.regular_400
  },
  inputAndroid: {
    fontSize: 16,
    padding: 12,
    paddingLeft: 24,
    backgroundColor: '#ffff',
    borderRadius: 16,
    color: '#605E70',
    height: 55,
    paddingRight: 30,
    fontFamily: typography.regular_400
  },
  iconContainer: {
    height: 48,
    justifyContent: 'center',
    paddingRight: 8
  },
  error: {
    color: 'red',
    fontSize: 12
  },
  label: {
    marginBottom: 6
  }
});
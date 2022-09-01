import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { color, scale, scaleVertical, typography } from 'utils';
import { Text } from './text';
import { Box } from './box';

export function TextField({
  style,
  leftIcon = null,
  rightIcon = null,
  onLeftIconPress = () => {},
  onRightIconPress = () => {},
  disabled = false,
  error = null,
  placeholder,
  label,
  textColor = 'text',
  ...rest
}) {
  const LeftIcon = leftIcon;
  const RightIcon = rightIcon;

  return (
    <>
      <Text variant='label' color={textColor} style={styles.label}>{label}</Text>
      <View style={[styles.container, disabled && styles.disabled]}>
        {LeftIcon ? (
          <TouchableOpacity onPress={onLeftIconPress}>
            <LeftIcon />
          </TouchableOpacity>
        ) : null}
        <TextInput
          placeholder={placeholder || ''}
          style={{
            ...styles.input,
            ...style,
          }}
          editable={!disabled}
          {...rest}
          ref={ref =>
            ref &&
            ref.setNativeProps({
              style: { fontFamily: typography.regular_400 },
            })
          }
        />
        {RightIcon ? (
          <TouchableOpacity onPress={onRightIconPress}>
            <RightIcon />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Box>
          <Text color="error">{error}</Text>
        </Box>
      ) : null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: scaleVertical(55),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: scale(16),
    borderColor: '#F2F6FD',
    backgroundColor: color.background,
    paddingHorizontal: scale(24),
  },
  input: {
    flex: 1,
    fontFamily: typography.regular_400,
    fontSize: scale(16),
    lineHeight: scale(18),
    letterSpacing: scale(-0.165),
    color: color.text
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    marginBottom: 6
  }
});

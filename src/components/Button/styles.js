import { StyleSheet } from 'react-native'

// styles
import { Colors } from '../../theme'

export default StyleSheet.create({
  primary: {
    color: Colors.white,
  },
  primaryBg: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    color: Colors.primary,
  },
  secondaryBg: {
    backgroundColor: Colors.white,
  },
  tertiary: {
    color: Colors.cinnamon,
  },
  tertiaryBg: {
    backgroundColor: Colors.goldenrod,
  },
  button: {
    height: 50,
    borderRadius: 10,
  },
  disabledStyle: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 1
  },
  borderStyle: {
    borderColor: Colors.deepsapphire,
    borderWidth: 1,
    shadowColor: 'transparent'
  },
});

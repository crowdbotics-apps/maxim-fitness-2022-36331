/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  white: '#ffffff',
  black: '#000000',
  primary: '#048ECC',
  secondary: '#ffffff',
  deepsapphire: '#093766',
  cinnamon: '#795401',
  nileblue: '#184653',
  goldenrod: '#FFD46F',
  athensgray: '#F8F7F9',
  alto: '#D6D6D6',
  brightturquoise: '#1DC6ED',
  brightturquoisesecond: '#14BEF7',
  athensgraySecond: '#F3F1F4',
  nobel: '#B4B1B1',
  azureradiance: '#019EF3',
  commonCol: '#6f6f6f',
  newCol: '#808080',

  // new added color
  punch: '#db3b26',

  error: '#dc3545'
};

/**
 * FontSize
 */
export const FontSize = {
  small: 10,
  regular: 12,
  medium: 16,
  large: 18,
};

/**
 * Metrics Sizes
 */
const zero = 0; // 0
const tiny = 5; // 5
const tiny2x = 7; // 7
const small = tiny * 2; // 10
const small2x = small * 2; // 20
const regular = tiny * 3; // 15
const medium = regular * 2; // 30
const mediumX = small2x * 2; // 40
const large = regular * 3; // 45
const largeX = mediumX + regular; // 55
export const MetricsSizes = {
  zero,
  tiny,
  tiny2x,
  small,
  small2x,
  regular,
  medium,
  mediumX,
  large,
  largeX,
};

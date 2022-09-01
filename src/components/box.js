import React from 'react';
import { View } from 'react-native';
import { color, scale, scaleVertical } from 'utils';

export function Box({
  style,
  backgroundColor = color.background,
  height,
  width,
  borderRadius,
  mt,
  mb,
  mv,
  ml,
  mr,
  mh,
  pt,
  pb,
  pv,
  pl,
  pr,
  ph,
  ...rest
}) {
  const styles = {
    marginTop: getGap(mt, 'vertical'),
    marginBottom: getGap(mb, 'vertical'),
    marginVertical: getGap(mv, 'vertical'),
    marginLeft: getGap(ml, 'horizontal'),
    marginRight: getGap(mr, 'horizontal'),
    marginHorizontal: getGap(mh, 'horizontal'),
    paddingTop: getGap(pt, 'vertical'),
    paddingBottom: getGap(pb, 'vertical'),
    paddingVertical: getGap(pv, 'vertical'),
    paddingLeft: getGap(pl, 'horizontal'),
    paddingRight: getGap(pr, 'horizontal'),
    paddingHorizontal: getGap(ph, 'horizontal'),
    height: getGap(height, 'vertical'),
    width: getGap(width, 'horizontal'),
    borderRadius: getGap(borderRadius, 'horizontal'),
    backgroundColor: color[backgroundColor],
  };
  Object.keys(styles).forEach(key => !styles[key] && delete styles[key]);

  return (
    <View
      style={{
        ...styles,
        ...style,
      }}
      {...rest}
    />
  );
}

const getGap = (value, axis) => {
  if (isNaN(value)) {
    return value;
  }
  return axis === 'vertical' ? scaleVertical(value) : scale(value);
};

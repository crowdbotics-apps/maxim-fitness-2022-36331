import { MetricsSizes } from './Variables'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  ...Object.entries(MetricsSizes).reduce(
    (acc, [key, value]) => ({
      ...acc,
      /* Margins */
      [`${key}BMargin`]: {
        marginBottom: value,
      },
      [`${key}TMargin`]: {
        marginTop: value,
      },
      [`${key}RMargin`]: {
        marginRight: value,
      },
      [`${key}LMargin`]: {
        marginLeft: value,
      },
      [`${key}VMargin`]: {
        marginVertical: value,
      },
      [`${key}HMargin`]: {
        marginHorizontal: value,
      },
      /* Paddings */
      [`${key}BPadding`]: {
        paddingBottom: value,
      },
      [`${key}TPadding`]: {
        paddingTop: value,
      },
      [`${key}RPadding`]: {
        paddingRight: value,
      },
      [`${key}LPadding`]: {
        paddingLeft: value,
      },
      [`${key}VPadding`]: {
        paddingVertical: value,
      },
      [`${key}HPadding`]: {
        paddingHorizontal: value,
      },
      [`${key}Padding`]: {
        padding: value,
      },
      [`${key}Margin`]: {
        margin: value,
      },
    }),
    {}
  ),
});

import React from 'react'

// components
import { View, StyleSheet } from 'react-native'
import { Text } from '../../../components'
import Button from '../../../components/Button'
import LinearGradient from 'react-native-linear-gradient'

import { Gutters, Layout, Global } from '../../../theme'

const Card = props => {
  const { onPress, getPlans, subsucriptionId } = props
  const {
    regularHMargin,
    regularVPadding,
    regularTMargin,
    mediumHMargin,
    mediumTMargin,
    regularHPadding,
  } = Gutters;
  const {
    row,
    fill,
    center,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentAround,
  } = Layout;
  const { border } = Global;
  const start = { x: 0, y: 0 };
  const end = { x: 1, y: 1 };
  return (
    <>
      <LinearGradient
        start={start}
        end={end}
        colors={['#57eff7', '#1153d7']}
        style={[fill, mediumHMargin, regularVPadding, regularTMargin, styles.gradientWrapper]}
      >
        <View style={[row, center, fill, mediumTMargin]}>
          <Text
            text={`$ ${getPlans.length > 0 ? getPlans[0].amount : ''}`}
            regularTitle
            color="secondary"
            bold
            center
          />
          <Text text={' / month'} large color="secondary" />
        </View>
        <View style={[fill, justifyContentAround, mediumHMargin]}>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Customized Exercise Program'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Dynamic social feed'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Data and analytics'} color="secondary" />
          </View>
        </View>
        <View
          style={[row, fill, justifyContentCenter, regularHMargin, alignItemsEnd, regularVPadding]}
        >
          <Text color="secondary" center style={{ fontSize: 14 }}>
            By subcribing to Orum Training, you agree to our {''}
            <Text text={'\nPrivacy Policy'} color="secondary" regular center underlined />
            {''} and {''}
            <Text text={'Terms of Services'} color="secondary" regular center underlined />
          </Text>
        </View>
      </LinearGradient>
      <View style={[center, row, { marginTop: -20, backgroundColor: 'transparent' }]}>
        <Button
          color="secondary"
          text={getPlans[0]?.id === subsucriptionId ? 'Already Bought' : 'Buy Now'}
          style={[border, center, regularHPadding, { height: 40, borderRadius: 30 }]}
          onPress={getPlans[0]?.id !== subsucriptionId ? onPress : null}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 40,
    height: 540,
  },
});

export default Card;

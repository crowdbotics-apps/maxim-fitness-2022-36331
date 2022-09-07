import React from 'react';

// components
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import Button from '../../../components/Button'
import LinearGradient from 'react-native-linear-gradient';

import {Gutters, Layout, Global} from '../../../theme';

const Card2s = ({onPress, getPlans}) => {
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
    fill3x,
    center,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentAround,
  } = Layout;
  const {border} = Global;
  const start = {x: 0, y: 0};
  const end = {x: 1, y: 1};
  return (
    <>
      <LinearGradient
        start={start}
        end={end}
        colors={['#ffd329', '#f81fe1']}
        style={[fill, mediumHMargin, regularVPadding, regularTMargin, styles.gradientWrapper]}
      >
        <View style={[row, center, fill, mediumTMargin]}>
          <Text
            text={`$1200`}
            regularTitle
            color="secondary"
            bold
          />
          <Text text={' / month'} large color="secondary" />
        </View>
        <View style={[fill3x, justifyContentAround, mediumHMargin]}>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{fontSize: 8, marginRight: 5}} />
            <Text text={'Customized Exercise Program'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{fontSize: 8, marginRight: 5}} />
            <Text text={'Voice diet tracking'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{fontSize: 8, marginRight: 5}} />
            <Text text={'Synergistic diet and exercise strategy'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{fontSize: 8, marginRight: 5}} />
            <Text text={'Dynamic social feed'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{fontSize: 8, marginRight: 5}} />
            <Text text={'Data and analytics'} color="secondary" />
          </View>
        </View>
        <View
          style={[row, fill, justifyContentCenter, regularHMargin, alignItemsEnd, regularVPadding]}
        >
          <Text color="secondary" center style={{fontSize: 14}}>
            By subcribing to Orum Training, you agree to our {''}
            <Text text={'\nPrivacy Policy'} color="secondary" regular center underlined />
            {''} and {''}
            <Text text={'Terms of Services'} color="secondary" regular center underlined />
          </Text>
        </View>
      </LinearGradient>
      <View
        style={[center, row, {paddingBottom: 20, marginTop: -20, backgroundColor: 'transparent'}]}
      >
        <Button
          color="secondary"
          text={'Buy Now'}
          style={[border, center, regularHPadding, {height: 40, borderRadius: 30}]}
          onPress={onPress}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  leftArrow: {
    zIndex: 22,
    left: 10,
    width: 50,
    height: 50,
  },
  iconWrapper: {
    fontSize: 50,
    lineHeight: 50,
  },
  gradientWrapper: {
    borderRadius: 40,
    height: 540,
  },
});

export default Card2s;

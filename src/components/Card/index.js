import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../Text';
import { Gutters, Layout, Global, Fonts } from '../../theme';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Card = ({ onPress, text, style, item }) => {
  const { smallVMargin, smallHMargin, smallLMargin, smallHPadding, small2xHPadding } = Gutters;
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout;
  const { secondaryBg, border, borderAlto } = Global;
  const { textRegular, textLarge } = Fonts;

  const getDayOfWeek = () => {
    const dayOfWeek = new Date(item.date_time).getDay();
    return isNaN(dayOfWeek) ? '' : days[dayOfWeek];
  };

  const todayDayStr = () => {
    const dateTime = new Date(item.date_time);
    return dateTime.getDate();
  };

  return (
    <TouchableOpacity
      style={[
        row,
        fill,
        secondaryBg,
        smallVMargin,
        small2xHPadding,
        justifyContentBetween,
        styles.mainWrapper,
        style,
      ]}
      onPress={onPress}
    >
      <View style={[fill, center, border, secondaryBg, smallHMargin, styles.mainInnerWrapper]}>
        <Text style={textLarge} color="quinary" bold text={todayDayStr()} />
        <Text style={textRegular} bold text={getDayOfWeek()} />
        <View style={styles.shadowStyle} />
      </View>

      <View
        style={[
          row,
          smallLMargin,
          smallHPadding,
          alignItemsCenter,
          styles.cardWrapper,
          { justifyContent: item && item.cardio === false ? 'center' : 'space-between' },
        ]}
      >
        {((item && item.cardio === false) || !item.workouts.length > 0) && (
          <View style={{ flex: 0.5 }} />
        )}
        <View
          style={[
            styles.cardWrapperInner,
            text === 'No WorkOut'
              ? { backgroundColor: '#fff', borderColor: '#fff' }
              : { borderColor: '#fead00', backgroundColor: '#fead00' },
          ]}
        >
          {text === 'No WorkOut' ? (
            <Text style={[styles.cardText, { color: 'black' }]}>No Workout</Text>
          ) : (
            <Text style={styles.cardText}>{text}</Text>
          )}
        </View>
        {item && item.cardio === true && item.workouts.length > 0 && (
          <>
            <View style={{ flex: 0.2 }} />
            <View style={styles.hideWrapper}>
              <Text style={styles.hideWrapperInner}>Cardio</Text>
            </View>
          </>
        )}
        {(item && item.cardio === false) ||
          (!item.workouts.length > 0 && <View style={{ flex: 0.5 }} />)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    height: 70,
  },
  mainInnerWrapper: {
    borderRadius: 15,
    borderColor: 'blue',
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  cardWrapper: {
    flex: 3,
    borderRadius: 20,
    backgroundColor: '#f3f1f4',
  },
  cardWrapperInner: {
    backgroundColor: '#fead00',
    height: 50,
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fead00',
  },
  cardText: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: 'bold',
    paddingHorizontal: 2,
    textAlign: 'center',
    color: 'white',
  },
  hideWrapper: {
    backgroundColor: '#ff644e',
    height: 50,
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fead00',
  },
  hideWrapperInner: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'white',
  },
});

export default Card;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Text, BottomSheet } from '../../../components';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';

import { Layout, Global, Gutters, Images, Colors } from '../../../theme';
import { Icon } from 'native-base';
import DatePicker from 'react-native-date-picker';
const FatLoseProgram = props => {
  const {
    navigation: { navigate },
  } = props;

  const datesBlacklistFunc = date => {
    return date.isoWeekday() === 6; // disable Saturdays
  };
  const { findbtn, etc, workoutbtn, workout1, workout2, workout3, threeLine, circle } = Images;
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout;
  const { smallVMargin, regularHMargin, tinyLMargin } = Gutters;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let refDescription = useRef('');

  //MarkedDates
  const markedDatesArray = [
    {
      date: new Date(),
      dots: [
        {
          color: 'red',
        },
        {
          color: 'blue',
        },
      ],
    },

    {
      date: '2022-09-23',
      dots: [
        {
          color: 'red',
        },
        {
          color: 'blue',
        },
      ],
    },
    {
      date: '2022-09-25',
      dots: [
        {
          color: 'red',
        },
        {
          color: 'blue',
        },
      ],
    },
  ];
  return (
    <SafeAreaView style={[fill, { backgroundColor: 'white' }]}>
      <ScrollView>
        <View style={[smallVMargin, regularHMargin]}>
          <Text style={styles.heading}>Max's Fat Loss Program</Text>
          <View style={[row, alignItemsCenter, justifyContentBetween, { marginTop: 20 }]}>
            <View style={[row]}>
              <Text
                onPress={() => {
                  // setDate(true);
                }}
                color="primary"
                text={`Week 1`}
                style={[tinyLMargin, styles.smallText]}
              />
              <Icon type="FontAwesome5" name="chevron-right" style={[styles.IconStyle]} />
            </View>
            <View style={[row]}>
              <Text
                text={`Calendar`}
                style={[tinyLMargin, styles.CalenderText]}
              // onPress={() => setOpen(true)}
              />
              <Icon
                type="FontAwesome5"
                name="chevron-right"
                style={[styles.IconStyle, { color: 'gray' }]}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <CalendarStrip
              dateNumberStyle={{ fontSize: 20 }}
              calendarHeaderStyle={{ color: 'white' }}
              dateNameStyle={{ fontSize: 15, color: 'grey' }}
              iconLeft={false}
              iconRight={false}
              datesBlacklist={datesBlacklistFunc}
              style={{ height: 80, width: 410 }}
              markedDates={markedDatesArray}
            // scrollable
            />
          </View>
          <Text text={`Today's Workout`} style={styles.headind2} />
          <View style={[styles.cardView]}>
            <View style={[row, justifyContentBetween]}>
              <Text text={`Day 3`} color="primary" style={styles.dayText} />
              <Image source={etc} style={styles.imgStyle} />
            </View>
            <View style={[row]}>
              <View style={[row]}>
                <Image source={workout1} style={{ width: 60, height: 60 }} />
                <Image source={workout2} style={{ width: 60, height: 60 }} />
              </View>
              <View>
                <Text
                  text="Chest, Triceps, Cardio"
                  style={{ fontSize: 15, lineHeight: 18, fontWeight: 'bold', opacity: 0.7 }}
                />
                <Text
                  text="8 exercies"
                  style={{
                    fontSize: 12,
                    lineHeight: 12,
                    fontWeight: '400',
                    opacity: 0.7,
                    marginTop: 15,
                  }}
                />
              </View>
            </View>
            <View style={[row]}>
              <View>
                <Image source={workout3} style={{ width: 60, height: 60 }} />
              </View>
              <View style={[row, fill, alignItemsCenter, { marginLeft: '18%' }]}>
                <Text
                  text="8 exercies"
                  style={{
                    fontSize: 12,
                    lineHeight: 12,
                    fontWeight: '400',
                    opacity: 0.7,
                  }}
                />
                <Text
                  text="Steady State"
                  style={{
                    fontSize: 15,
                    lineHeight: 18,
                    fontWeight: 'bold',
                    opacity: 0.7,
                    marginLeft: 30,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => refDescription.current.open()}>
              <Image source={findbtn} style={styles.btn1} />
            </TouchableOpacity>
          </View>
          {/* <View style={[styles.cardView]}>
            <View style={[row, justifyContentBetween]}>
              <Text text={`Day 3`} color="primary" style={styles.dayText} />
              <Image source={etc} style={styles.imgStyle} />
            </View>
            <Text
              text={`Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput. `}
              style={{
                fontSize: 12,
                lineHeight: 16,
                color: 'gray',
                fontWeight: '500',
              }}
            />

            <Image source={findbtn} style={styles.btn1} />
          </View> */}
          <View style={[center, styles.cardView2]}>
            <Text text={`Create the a Custom Workout`} style={styles.heading3} />
            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
              <Text
                text={`Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput`}
                style={styles.praText}
              />
              <TouchableOpacity onPress={() => navigate('AddExercise')}>
                <Image source={workoutbtn} style={styles.btn2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* bootom */}
      <BottomSheet
        reff={refDescription}
        h={200}
        Iconbg={'white'}
        bg={'white'}
        customStyles={{
          draggableIcon: {
            backgroundColor: 'red',
          },
        }}
      >
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[{ width: '100%', marginTop: 20, paddingLeft: 40, backgroundColor: 'white' }]}
        >
          <View style={[regularHMargin, {}]}>
            <View style={[row, alignItemsCenter]}>
              <Image source={threeLine} style={{ width: 50, height: 50 }} />
              <Text
                text={`View Workout`}
                style={{
                  fontSize: 20,
                  lineHeight: 18,
                  fontWeight: 'bold',
                  opacity: 0.7,
                  color: 'black',
                  marginLeft: 50,
                }}
              />
            </View>
            <View style={[row, alignItemsCenter, { marginTop: 20 }]}>
              <Image source={circle} style={{ width: 50, height: 50 }} />
              <Text
                text={`Resechedule Workout`}
                style={{
                  fontSize: 20,
                  lineHeight: 18,
                  fontWeight: 'bold',
                  opacity: 0.7,
                  color: 'black',
                  marginLeft: 50,
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 40,
    marginTop: 10,
    opacity: 0.8,
  },
  smallText: { fontSize: 15, lineHeight: 18 },
  IconStyle: { color: Colors.primary, fontSize: 15, marginLeft: 3 },
  CalenderText: { fontSize: 15, lineHeight: 18, color: 'gray' },
  headind2: {
    fontSize: 25,
    lineHeight: 30,
    color: 'black',
    marginTop: 25,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  cardView: {
    padding: 13,
    marginTop: 15,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5,
  },
  dayText: {
    fontSize: 12,
    lineHeight: 20,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  imgStyle: { height: 25, width: 30, marginRight: 10 },
  btn1: { height: 50, width: 140, alignSelf: 'center', marginVertical: 10 },
  cardView2: {
    borderWidth: 2,
    padding: 13,
    marginTop: 40,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderColor: Colors.primary,
  },
  heading3: {
    fontSize: 15,
    lineHeight: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  praText: {
    fontSize: 12,
    lineHeight: 16,
    color: 'gray',
    fontWeight: '500',
    textAlign: 'left',
  },
  btn2: { height: 50, width: 150, alignSelf: 'center', marginTop: 10 },
});
export default FatLoseProgram;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Text, BottomSheet } from '../../../components';
import CalendarStrip from 'react-native-calendar-strip';
import { Layout, Global, Gutters, Images, Colors } from '../../../theme';
import { Icon } from 'native-base';
import { connect } from 'react-redux'
import { getDaySessionRequest, getAllSessionRequest } from '../../../ScreenRedux/programServices'
import moment from 'moment'

const FatLoseProgram = props => {
  const { navigation, todayRequest, todaySessions, getAllSessions } = props;

  const [activeIndex, setActiveIndex] = useState(1);
  const [index, setIndex] = useState(0);
  const [weekDate, setWeekDate] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const newDate = moment(new Date()).format('YYYY-MM-DD');
      props.getAllSessionRequest(newDate);
      props.getDaySessionRequest(newDate)
    });
    return unsubscribe;
  }, [navigation]);

  // console.log('todaySessions: ', todaySessions);
  // console.log('getAllSessions: ', getAllSessions);

  const datesBlacklistFunc = date => {
    // console.log('date.isoWeekday()', date.isoWeekday());
    return date.isoWeekday() === new Date().getDay() - 1; // disable Saturdays
  };


  const { findbtn, etc, workoutbtn, workout1, workout2, workout3, threeLine, circle } = Images;
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout;
  const { smallVMargin, regularHMargin, tinyLMargin } = Gutters;
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

    // {
    //   date: '2022-09-23',
    //   dots: [
    //     {
    //       color: 'red',
    //     },
    //     {
    //       color: 'blue',
    //     },
    //   ],
    // },
    // {
    //   date: '2022-09-25',
    //   dots: [
    //     {
    //       color: 'red',
    //     },
    //     {
    //       color: 'blue',
    //     },
    //   ],
    // },
  ];

  const onDateSelected = () => {
    const newDate = moment(new Date()).format('YYYY-MM-DD');
    props.getAllSessionRequest(newDate);
  }


  const nextExercise = () => {
    if (getAllSessions?.week > activeIndex) {
      setActiveIndex(prevState => prevState + 1);
      if (getAllSessions?.query?.length) {
        const today = new Date(getAllSessions.query[0].date_time);
        const lastDay = new Date(today.setDate(today.getDate() + 7));
        const hh = moment(lastDay).format('YYYY-MM-DD');
        props.getAllSessionRequest(hh);
        props.getDaySessionRequest(hh)
      }
    }
  };

  const previousExercise = () => {
    if (activeIndex > 1) {
      setActiveIndex(prevState => prevState - 1);
      if (getAllSessions?.query?.length) {
        const today = new Date(getAllSessions.query[0].date_time);
        const lastDay = new Date(today.setDate(today.getDate() - 7));
        const hh = moment(lastDay).format('YYYY-MM-DD');
        props.getAllSessionRequest(hh);
        props.getDaySessionRequest(hh)
      }
    }
  };

  const selectDay = (item, i) => {
    setIndex(i)
    const newDate = moment(item.date_time).format('YYYY-MM-DD');
    props.getDaySessionRequest(newDate);
  }

  const pp = new Date(todaySessions?.id && todaySessions?.date_time)
  const weekDay = pp?.getDay()

  return (
    <SafeAreaView style={[fill, Global.secondaryBg]}>
      <ScrollView>
        <View style={[smallVMargin, regularHMargin]}>
          <Text style={styles.heading}>Max's Fat Loss Program</Text>
          <View style={[row, alignItemsCenter, justifyContentBetween, Gutters.small2xTMargin]}>
            <TouchableOpacity style={row} onPress={getAllSessions?.week > activeIndex ? nextExercise : previousExercise}>
              <Text
                color="primary"
                text={'Week 1'}
                style={[tinyLMargin, styles.smallText]}
              />
              <Icon type="FontAwesome5" name={getAllSessions?.week > 0 && activeIndex > 1 ? "chevron-left" : "chevron-right"} style={[styles.IconStyle]} />
            </TouchableOpacity>
            <View style={[row]}>
              <Text
                text={'Calendar'}
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
          <View style={Layout.alignItemsCenter}>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
              {getAllSessions?.query?.map((d, i) => {
                const day = new Date(d.date_time).getDate()
                const weekDayName = moment(d.date_time).format('dd');
                return (
                  <TouchableOpacity key={i} onPress={() => selectDay(d, i)} style={{ marginHorizontal: 10, marginVertical: 10, alignItems: 'center' }}>
                    <Text
                      text={
                        weekDayName === 'Tu' && 'T' ||
                        weekDayName === 'We' && 'W' ||
                        weekDayName === 'Th' && 'T' ||
                        weekDayName === 'Fr' && 'F' ||
                        weekDayName === 'Sa' && 'S' ||
                        weekDayName === 'Su' && 'S' ||
                        weekDayName === 'Mo' && 'M'
                      }
                      style={{ fontSize: 15, lineHeight: 18, fontWeight: 'bold', opacity: 0.7 }}
                    />
                    <View style={{ width: 25, height: 25, marginTop: 5, backgroundColor: index === i ? "#87CEEB" : 'white', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                      <Text
                        text={day}
                        style={{ fontSize: 15, lineHeight: 18, fontWeight: 'bold', opacity: 0.7 }}
                      />
                    </View>
                    {
                      d?.name !== 'Rest' ?
                        <View style={[row]}>
                          <View style={{ backgroundColor: 'red', height: 7, width: 8, borderRadius: 10 }} />
                          <View style={{ backgroundColor: 'green', left: -2, height: 7, width: 8, borderRadius: 10 }} />
                        </View>
                        : null
                    }
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
            {/* <CalendarStrip
              dateNumberStyle={{ fontSize: 20 }}
              calendarHeaderStyle={{ color: 'white' }}
              dateNameStyle={{ fontSize: 15, color: 'grey' }}
              iconLeft={false}
              iconRight={false}
              style={{ height: 80, width: Dimensions.get('screen').width }}
              // datesBlacklist={datesBlacklistFunc}
              markedDates={markedDatesArray}
              onDateSelected={onDateSelected}
            /> */}
          </View>
          {todayRequest ?
            <View style={[Layout.center, { height: 200 }]}>
              <ActivityIndicator size='large' color='green' />
            </View>
            :
            todaySessions?.length < 1 ?
              <View style={[Layout.center, { height: 200 }]}>
                <Text text={"No workout found!"} style={styles.headind2} />
              </View>
              :
              todaySessions?.name !== 'Rest' ?
                <View>
                  <Text text={
                    todaySessions.date_time === moment(new Date()).format('YYYY-MM-DD') ?
                      "Today's Workout"
                      :
                      `${moment(todaySessions.date_time).format('dddd')}'s Workout`
                  } style={styles.headind2} />
                  <View style={styles.cardView}>
                    <View style={[row, justifyContentBetween]}>
                      <Text text={`Day ${weekDay === 0 ? 7 : weekDay}`} color="primary" style={styles.dayText} />
                      <Image source={etc} style={styles.imgStyle} />
                    </View>
                    <View style={row}>
                      <View style={row}>
                        <Image source={workout1} style={{ width: 60, height: 60 }} />
                        <Image source={workout2} style={{ width: 60, height: 60 }} />
                      </View>
                      <View>
                        <Text
                          text={todaySessions?.name}
                          style={{ fontSize: 15, lineHeight: 18, fontWeight: 'bold', opacity: 0.7 }}
                        />
                        <Text
                          text={`8 exercies`}
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
                </View>
                :
                <View>
                  <Text text={"Rest day"} style={styles.headind2} />
                  <View style={styles.cardView}>
                    <View style={[row, justifyContentBetween]}>
                      <Text text={`Day ${weekDay === 0 ? 7 : weekDay}`} color="primary" style={styles.dayText} />
                      <Image source={etc} style={styles.imgStyle} />
                    </View>
                    <View style={[row, Gutters.smallVMargin]}>
                      <Text
                        text={
                          'Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput'
                        }
                        style={{
                          fontSize: 13,
                          lineHeight: 16,
                          color: 'black',
                          fontWeight: '500',
                          textAlign: 'left',
                          opacity: 0.8
                        }}
                      />
                    </View>
                    <TouchableOpacity onPress={() => refDescription.current.open()}>
                      <Image source={findbtn} style={styles.btn1} />
                    </TouchableOpacity>
                  </View>
                </View>
          }
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
            <Text text={'Create the a Custom Workout'} style={styles.heading3} />
            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
              <Text
                text={
                  'Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput'
                }
                style={styles.praText}
              />
              <TouchableOpacity onPress={() => navigation.navigate('AddExercise')}>
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
                text={'View Workout'}
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
                text={'Resechedule Workout'}
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
    fontSize: 13,
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
// export default FatLoseProgram;
const mapStateToProps = (state) => ({
  todayRequest: state.programReducer.todayRequest,
  todaySessions: state.programReducer.todaySessions,
  getAllSessions: state.programReducer.getAllSessions
})

const mapDispatchToProps = (dispatch) => ({
  getDaySessionRequest: data => dispatch(getDaySessionRequest(data)),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FatLoseProgram)

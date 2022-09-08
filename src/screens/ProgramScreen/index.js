import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Icon } from 'native-base';
import { Gutters, Layout, Global, Colors } from '../../theme';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { Card, WorkoutComponent, Text } from '../../components';
import { useNetInfo } from '@react-native-community/netinfo';
import { getAllSessionRequest } from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ProgramScreen = props => {
  const {
    navigation,
    pickSessionAction,
    getAllSessions,
    loadingAllSession,
    saveSwipeDateAction,
    getAllSwapExercise,
  } = props;
  let saveSwipeState = { weekDate: new Date(), activeIndex: 1, data: new Date() };
  const [show, setShow] = useState(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    saveSwipeState.activeIndex ? saveSwipeState.activeIndex : 1
  );
  const [weekDate, setWeekDate] = useState('');
  const [newScreen, setNewScreen] = useState(false);

  const { tinyLMargin, tinyRMargin } = Gutters;
  const { row, fill, center, alignItemsCenter, justifyContentEnd, justifyContentBetween } = Layout;
  const { secondaryBg, turtiaryBg } = Global;
  const isFocused = useIsFocused();
  console.log('getAllSessions: ', getAllSessions);
  let netInfo = useNetInfo();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (saveSwipeState?.weekDate) {
      //   props.getAllSessionRequest(saveSwipeState?.weekDate);
      // } else {
      const newDate = moment(new Date()).format('YYYY-MM-DD');
      setWeekDate(newDate);
      props.getAllSessionRequest(newDate);
      // }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    getAllSessions?.query?.filter(session => {
      if (
        session.workouts.length &&
        moment(new Date()).format('YYYY-MM-DD') === moment(session.date_time).format('YYYY-MM-DD')
      ) {
        session.workouts.filter(workout => {
          workout.sets.forEach(item => {
            if (item.set_type === 'Ct') {
              setNewScreen(true);
            }
          });
        });
      }
    });
  }, [getAllSessions]);

  const nextExercise = () => {
    if (getAllSessions?.week > activeIndex) {
      setActiveIndex(prevState => prevState + 1);
      if (getAllSessions?.query?.length) {
        const today = new Date(getAllSessions.query[0].date_time);
        const lastDay = new Date(today.setDate(today.getDate() + 7));
        const hh = moment(lastDay).format('YYYY-MM-DD');
        props.resetSwipeDateAction();
        setWeekDate(hh);
        props.getAllSessionRequest(hh);
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
        props.resetSwipeDateAction();
        setWeekDate(hh);
        props.getAllSessionRequest(hh);
      }
    }
  };

  return (
    <SafeAreaView style={[fill, secondaryBg]}>
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[fill, row, justifyContentBetween, alignItemsCenter, styles.preview]}>
          <TouchableOpacity
            style={[alignItemsCenter, fill, row, styles.buttonWrapper]}
            onPress={previousExercise}
            disabled={loading || loadingAllSession}
          >
            {getAllSessions?.week > 0 && activeIndex > 1 && (
              <>
                <Icon type="FontAwesome5" name="caret-left" />
                <Text
                  color="primary"
                  text={`Week ${activeIndex - 1}`}
                  style={[tinyLMargin, { fontSize: 15, lineHeight: 18 }]}
                />
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[justifyContentEnd, alignItemsCenter, fill, row, styles.buttonWrapper]}
            onPress={nextExercise}
            disabled={loading || loadingAllSession}
          >
            {getAllSessions?.week > activeIndex && (
              <>
                <Text
                  color="primary"
                  text={`Week ${activeIndex + 1}`}
                  style={[tinyRMargin, { fontSize: 15, lineHeight: 18 }]}
                />
                <Icon type="FontAwesome5" name="caret-right" />
              </>
            )}
          </TouchableOpacity>
        </View>
        <>
          {/* {netInfo.isConnected ? (
            loading || loadingAllSession ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : (
              <>
                {!getAllSessions?.query?.length ? (
                  <>
                    {getAllSessions?.query?.map((item, index) => {
                      let currentD = moment(new Date()).format('YYYY-MM-DD');
                      let cardDate = moment(item.date_time).format('YYYY-MM-DD');

                      const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
                        workoutItem => !workoutItem.done
                      );

                      let newDate = moment(saveSwipeState?.date).format('YYYY-MM-DD');

                      return ( */}
          <View style={fill}>
            <View style={fill}>
              {/* {(show
                ? show === index + 1
                : saveSwipeState?.date
                  ? newDate === cardDate
                  : currentD === cardDate) && (
                  <>
                    {item.workouts.length > 0 ? ( */}
              <View>
                <WorkoutComponent
                  onPress={() => {
                    navigation.navigate('ExerciseScreen')
                    //   if (itemWorkoutUndone) {
                    //     pickSessionAction(
                    //       itemWorkoutUndone,
                    //       item.workouts,
                    //       nextWorkout
                    //     );
                    //     navigation.navigate(
                    //       newScreen ? 'ExerciseSets' : 'ExerciseScreen',
                    //       { workouts: item.workouts, item: item }
                    //     );
                    //   }
                  }}
                  // isDone={!itemWorkoutUndone}
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  // startWorkout={currentD === cardDate}
                  // itemData={item}
                  navigation={navigation}
                  saveSwipeDateAction={saveSwipeDateAction}
                  weekDate={weekDate}
                  activeIndex={activeIndex}
                  setWeekDate={setWeekDate}
                  getAllSwapExercise={getAllSwapExercise}
                  setActiveIndex={setActiveIndex}
                />
              </View>
              {/* ) : (
                      <View style={[turtiaryBg, center, { height: 100 }]}>
                        <Text text="No Workout for Today" bold />
                      </View>
                    )}
                  </>
                )} */}
            </View>
            <View>
              <Card
                style={
                  // (show
                  //   ? show === index + 1
                  //   : newDate
                  //     ? newDate === cardDate
                  //     : currentD === cardDate) && 
                  {
                    backgroundColor: Colors.alto,
                  }
                }
                // key={index}
                // onPress={() => setShow(show === index + 1 ? undefined : index + 1)}
                text={'No WorkOut'}
              // text={item.workouts.length > 0 ? item.name : 'No WorkOut'}
              // item={item}
              />
            </View>
          </View>
          {/* );
                    })}
                  </>
                ) : (
                  <View style={[center, styles.noProgramWrapper]}>
                    <Text text="No Program Assigned!" style={styles.noProgramWrapperText} />
                  </View>
                )}
              </>
            )
          ) : (
            <View style={[center, styles.noProgramWrapper]}>
              <View style={[fill, center]}>
                <Text style={styles.emptyListLabel}>{'Network error!'}</Text>
              </View>
            </View>
          )} */}
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInnerWrapper: {
    height: 60,
  },
  tabButtonsContainer: {
    width: 110,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    paddingVertical: 5,
    borderBottomWidth: 2,
  },
  leftArrowStyle: {
    width: 30,
    height: 30,
  },
  preview: {
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
  },
  buttonWrapper: {
    height: 30,
  },
  noProgramWrapper: { height: 500 },
  noProgramWrapperText: { color: 'black', fontSize: 30 },
});

const mapStateToProps = state => ({
  getAllSessions: state.programReducer.getAllSessions,
  // exerciseSwapped: state.sessions && state.sessions.exerciseSwapped,
  // loadingAllSession: state.sessions && state.sessions.loadingAllSession,
  // saveSwipeState: state.sessions && state.sessions.saveSwipeState,
  // resetSwipeAction: state.sessions && state.sessions.resetSwipeAction,
});

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: (data) => dispatch(getAllSessionRequest(data)),
  // pickSessionAction: (data) => dispatch(pickSession(data)),
  // saveSwipeDateAction: () => dispatch(saveSwipeDateAction()),
  // resetSwipeDateAction: () => dispatch(resetSwipeDateAction()),
  // getAllSwapExercise: () => dispatch(allSwapExercise()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgramScreen);


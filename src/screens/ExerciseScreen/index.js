import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import ExerciseTabHeader from '../../components/ExerciseTabHeader';
import SetButton from '../../components/SetButton';
import VideoExercise from '../../components/VideoExercise';
import FatExerciseButton from '../../components/FatExerciseButton';
import FatExerciseIconButton from '../../components/FatExerciseIconButton';
import FatGradientIconButton from '../../components/FatGradientIconButton';
import RestContainer from '../../components/RestContainer';
import BottomSheet from '../../components/BottomSheet'
// import Routes from '../../Routes';
import Modal from 'react-native-modal';
import { Input } from 'native-base';
import { Button, Text } from '../../components';
import { Layout, Global, Gutters, Images, Colors } from '../../theme';
import FatExerciseButtonWeight from '../../components/FatExerciseButtonWeight';
import LinearGradient from 'react-native-linear-gradient';
import StaticTimer from '../../components/StaticTimer';
import moment from 'moment';
import { getAllSessionRequest } from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ExerciseScreen = props => {
  const {
    navigation,
    exercisesObj,
    selectedSession,
    findAndMarkAsDoneSetAction,
    pickSessionAction,
    nextWorkout,
    updateSetWeightAction,
    updateSetWeightActionReps,
    markWorkoutDone,
    individualSetsDetails,
    individualSets,
    route,
    allSessions,
    pickExerciseObject,
    innerExercise,
  } = props;

  let refRBSheet = useRef('');
  let refRBSheetWeight = useRef('');
  let refRBSheetDescription = useRef('');

  const [activeSet, setActiveSet] = useState({});
  const [isClickedOnActive, setIsClickedOnActive] = useState(false);
  const [startCount, setStartCount] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [freeToGoToNext, setFreeToGoToNext] = useState(false);
  const [showModalWeightTwo, setShowModalWeightTwo] = useState(false);
  const [showModalWeightThree, setShowModalWeightThree] = useState(false);
  const [showModalRepsTwo, setShowModalRepsTwo] = useState(false);
  const [showModalRepsThree, setShowModalRepsThree] = useState(false);

  const [weight, setWeight] = useState('');
  const [weightTwo, setWeightTwo] = useState('');
  const [weightThree, setWeightThree] = useState('');
  const [reps, setReps] = useState('');
  const [repsTwo, setRepsTwo] = useState('');
  const [repsThree, setRepsThree] = useState('');

  const [startTimer, setStartTimer] = useState(false);
  const [startRest, setStartRest] = useState(false);
  const [setsDone, setSetsDone] = useState(0);
  const [loadingReps, setLoadingReps] = useState(0);
  const [loadingWeight, setLoadingWeight] = useState(0);
  const [loadingSecond, setLoadingSecond] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [changeCol, setChangeCol] = useState(false);
  const [changeColor, setChangeColor] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false);

  // let active = activeSet?.set_type;

  // useEffect(() => {
  //   const newDate = moment(new Date()).format('YYYY-MM-DD');
  //   // setWeekDate(newDate);
  //   props.getAllSessionRequest(newDate);
  // }, [])

  // useEffect(() => {
  //   activeSet?.exercises?.reverse();
  // }, [activeSet]);

  // useEffect(() => {
  //   pickExerciseObject(activeSet?.exercises?.length > 0 && activeSet?.exercises[0]);
  // }, [activeSet]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (active && active.toLowerCase() === 'ss') {
  //       setOpenModal(!openModal);
  //     }
  //     if (active && active.toLowerCase() === 'gs') {
  //       setOpenModal(!openModal);
  //     }
  //     if (active && active.toLowerCase() === 'ds') {
  //       setOpenModal(!openModal);
  //     }
  //     if (active && active.toLowerCase() === 'tds') {
  //       setOpenModal(!openModal);
  //     }
  //     if (active && active.toLowerCase() === 'ct') {
  //       setOpenModal(!openModal);
  //     }
  //   }, 500);
  // }, [activeSet]);

  // useEffect(() => {
  //   isFocused && setFreeToGoToNext(setWorkoutDone.status === 200);
  // }, [isFocused]);

  // useEffect(() => {
  //   const [activeSetFind] = exercisesObj.sets && exercisesObj?.sets?.filter(item => item?.id);
  //   setAllDone(!activeSetFind);
  //   setActiveSet(activeSetFind);
  // }, [exercisesObj, activeSet]);

  // useEffect(() => {
  //   if (isClickedOnActive) {
  //     setStartCount(true);
  //   }
  // }, [isClickedOnActive]);

  // const stopTimer = () => {
  //   if (startTimer) {
  //     setStartTimer(false);
  //   }
  // };

  // const NextScreen = async () => {
  //   let workoutId = 0;
  //   allSessions &&
  //     allSessions.query &&
  //     allSessions.query.map(item => {
  //       item.workouts.map(workout => {
  //         if (workout.id === selectedSession[0].id) {
  //           workoutId = item.id;
  //         }
  //       });
  //     });
  //   setLoadingSecond(true);
  //   const newDate = moment(new Date()).format('YYYY-MM-DD');
  //   props.getAllSessions(newDate);
  //   let obj =
  //     allSessions &&
  //     allSessions.query &&
  //     allSessions.query.find(session => session.id === workoutId);
  //   setLoadingSecond(false);
  //   stopTimer();
  //   navigation.navigate('WorkoutCard', { item: obj.workouts, uppercard: route });
  // };

  // let countLength = exercisesObj?.sets?.length - 1;

  const {
    row,
    fill,
    center,
    fill2x,
    fill4x,
    fillHalf,
    fillGrow,
    fullWidth,
    fillOnePoint5,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentStart,
    justifyContentCenter,
    justifyContentBetween,
  } = Layout;
  const {
    border,
    punchBg,
    height40,
    borderR10,
    secondaryBg,
    halfOpacityBg,
    blackOpacityBg,
    topLRBorderRadius20,
  } = Global;
  const {
    zeroMargin,
    zeroPadding,
    tinyHPadding,
    smallVMargin,
    smallHMargin,
    largeTPadding,
    largeBPadding,
    smallHPadding,
    regularHMargin,
    regularVMargin,
    tiny2xHPadding,
  } = Gutters;

  // const onUpdate = async () => {
  //   refRBSheetWeight.current.close();
  //   activeSet?.id && setChangeColor(true);
  //   setLoadingWeight(true);
  //   await updateSetWeightAction(
  //     individualSets ? individualSets.id : activeSet.id,
  //     `${weight}${showModalWeightTwo ? '/' : ''}${showModalWeightThree ? '/' : ''}${weightTwo}${showModalWeightThree ? '/' : ''
  //     }${weightThree}`
  //   );
  //   setActiveSet({
  //     ...activeSet,
  //     weight: `${weight}${showModalWeightTwo ? '/' : ''}${showModalWeightThree ? '/' : ''
  //       }${weightTwo}${showModalWeightThree ? '/' : ''}${weightThree}`,
  //   });
  //   setWeight('');
  //   setWeightTwo('');
  //   setWeightThree('');

  //   const newDate = moment(new Date()).format('YYYY-MM-DD');
  //   props.getAllSessions(newDate);
  //   setLoadingWeight(false);
  // };
  // const onUpdateSets = async () => {
  //   refRBSheet.current.close();
  //   activeSet?.id && setChangeCol(true);
  //   setLoadingReps(true);
  //   await updateSetWeightActionReps(
  //     individualSets ? individualSets.id : activeSet.id,
  //     `${reps}${showModalRepsTwo ? '/' : ''}${showModalRepsThree ? '/' : ''}${repsTwo}${showModalRepsThree ? '/' : ''
  //     }${repsThree}`
  //   );
  //   setActiveSet({
  //     ...activeSet,
  //     reps: `${reps}${showModalRepsTwo ? '/' : ''}${showModalRepsThree ? '/' : ''}${repsTwo}${showModalRepsThree ? '/' : ''
  //       }${repsThree}`,
  //   });
  //   setReps('');
  //   setRepsTwo('');
  //   setRepsThree('');

  //   const newDate = moment(new Date()).format('YYYY-MM-DD');
  //   props.getAllSessions(newDate);
  //   setLoadingReps(false);
  // };

  // const getIndividualData = async id => {
  //   setLoadingReps(true);
  //   setLoadingWeight(true);
  //   if (activeSet.id && activeSet.done) {
  //     setChangeCol(false);
  //     setChangeColor(false);
  //   } else {
  //     setChangeCol(true);
  //     setChangeColor(true);
  //   }
  //   await individualSetsDetails(id);
  //   setLoadingReps(false);
  //   setLoadingWeight(false);
  // };

  const startSocial = { x: 0, y: 0 };
  const endSocial = { x: 1, y: 0 };

  const SetsComponents = ({ colors, text }) => {
    return (
      <View style={[row, center]}>
        <View style={fill} />
        <LinearGradient
          start={startSocial}
          end={endSocial}
          colors={colors}
          style={[fill2x, center, row, borderR10, punchBg, height40, tiny2xHPadding]}
        >
          <Text color="secondary" text={text} large bold center />
        </LinearGradient>
        <View style={fill} />
      </View>
    );
  };

  // const doneButtonAction = async item => {
  //   findAndMarkAsDoneSetAction();
  //   setSetsDone(setsDone + 1);
  //   if (setsDone === item.sets.length - 1) {
  //     markWorkoutDone(item.id);
  //     setSetsDone(0);
  //     setFreeToGoToNext(true);
  //     setStartRest(true);
  //     setShowBar(true);
  //     const newDate = moment(new Date()).format('YYYY-MM-DD');
  //     props.getAllSessions(newDate);
  //   }
  //   if (allDone) {
  //     setFreeToGoToNext(!freeToGoToNext);
  //   }
  //   setStartRest(!startRest);
  //   setShowBar(!showBar);
  //   if (active && active.toLowerCase() === 'gs') {
  //     setStartRest(false);
  //     setShowBar(false);
  //   }
  //   if (active && active.toLowerCase() === 'ds') {
  //     setStartRest(false);
  //     setShowBar(false);
  //   }
  //   if (active && active.toLowerCase() === 'tds') {
  //     setStartRest(false);
  //     setShowBar(false);
  //   }
  // };

  return (
    <SafeAreaView style={[fill]}>
      <ScrollView contentContainerStyle={[fillGrow, secondaryBg]}>
        <View style={[row, alignItemsCenter, justifyContentCenter, smallVMargin]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftIconStyle}>
            <Image style={styles.leftImageStyle} source={Images.backArrow} />
          </TouchableOpacity>
          <View style={[row, alignItemsCenter, styles.timerStyle]}>
            <StaticTimer startTimer={startTimer} />
          </View>
          <View />
        </View>

        <View style={fill}>

          <View style={[row, alignItemsCenter, { backgroundColor: 'white', height: 60 }]}>

            <ScrollView
              horizontal
              contentContainerStyle={fillGrow}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
            >

              {[1, 2, 3, 4, 5, 6].map((item, i) => {
                return (
                  <>
                    <TouchableOpacity
                      style={[row, center, borderR10, height40, { minWidth: 100, marginHorizontal: 5, backgroundColor: 'pink' }]}
                    >
                      <View style={[center, row, fill, smallHPadding]}>
                        <Text
                          center
                          regular
                          color="quinary"
                          ellipsizeMode="tail"
                          numberOfLines={3}
                          text={'name'}
                        />
                      </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={[borderR10, height40, { minWidth: 100, marginLeft: 10, backgroundColor: 'red', position: 'absolute', top: -20, zIndex: 999 }]}
                  >
                    <View style={[center, row, fill, smallHPadding]}>
                      <Text
                        center
                        regular
                        color="quinary"
                        ellipsizeMode="tail"
                        numberOfLines={3}
                        text={'name'}
                      />
                    </View>
                  </TouchableOpacity> */}
                  </>
                )
              })}


            </ScrollView>
          </View>
          {/*===============================================*/}
          <View style={[fill, row, center, { backgroundColor: 'pink' }]}>
            <VideoExercise
              videoUrl={{
                uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
              }}
              onLoadStart={() => setVideoLoader(true)}
              onLoad={() => setVideoLoader(false)}
              style={{ backgroundColor: 'red', weight: '100%', height: '100%' }}
            />
          </View>
          <View style={[center, { height: 60, backgroundColor: 'blue' }]}>
            <SetsComponents colors={['#f19a38', '#f7df58']} text={'Super Sets'} />
          </View>

          <View style={[row, alignItemsCenter, { height: 60, backgroundColor: 'yellow' }]}>
            <ScrollView
              horizontal
              contentContainerStyle={fillGrow}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
            >
              {[1, 2, 3, 4].map((item, i) => {
                return (
                  <>
                    <TouchableOpacity style={height40}>
                      <SetButton />
                    </TouchableOpacity>
                  </>
                )
              })}
            </ScrollView>
          </View>


          <View style={[row, tinyHPadding, styles.buttonWrapper]}>
            <FatExerciseButton
              buttonLabel="Reps"
              onClick={() => refRBSheet.current.open()}
              changeCol={changeCol}
            />
            <FatExerciseButtonWeight
              buttonLabel="Weight"
              onClick={() => refRBSheetWeight.current.open()}
              changeColor={changeColor}
            />
          </View>

          <View style={[fullWidth, row, tinyHPadding, styles.buttonWrapper]}>
            <FatExerciseIconButton
              buttonText="Exercise Description"
              onClick={() => refRBSheetDescription.current.open()}
              buttonIcon={Images.detailIcon}
            />
            <FatExerciseIconButton
              buttonText="Swap Exercise"
              buttonIcon={Images.iconSwap}
            />

            <FatGradientIconButton
              buttonText={
                true
                  ? 'Done'
                  : 'Done, Start Rest'
              }
              buttonIcon={Images.iconDoneStartRest}
              colorsGradient={['#3180BD', '#6EC2FA']}
              colorsGradientDisable={['#d3d3d3', '#838383']}
            />
          </View>
          <RestContainer upNext={'next'} showBar={true} />
          {/*===============================================*/}
        </View>
      </ScrollView>
      {/*===============================================*/}
      <BottomSheet reff={refRBSheetWeight} h={360}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={[fill, { width: '100%', marginTop: 20 }]}
        >
          <View style={[fill, zeroMargin, zeroPadding]}>
            <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
              <View style={[fill, row, regularHMargin, justifyContentBetween, { minHeight: 60 }]}>
                <View style={[alignItemsCenter, fill, height40, row]}>
                  <Text text="Round One" color="septenary" bold center medium />
                </View>

                <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                  <Input
                    inputStyle={border}
                    value={weight}
                    onChangeText={val => setWeight(val)}
                    placeholder="Enter Weight"
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            {showModalWeightTwo && (
              <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                <View style={[fill, row, regularHMargin, justifyContentBetween, { minHeight: 60 }]}>
                  <View style={[alignItemsCenter, fill, height40, row]}>
                    <Text text="Round Two" color="septenary" bold center medium />
                  </View>
                  <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                    <Input
                      inputStyle={border}
                      value={weightTwo}
                      onChangeText={val => setWeightTwo(val)}
                      placeholder="Enter Weight"
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            {showModalWeightThree && (
              <>
                <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                  <View style={[fill, row, regularHMargin, justifyContentBetween, { minHeight: 60 }]}>
                    <View style={[alignItemsCenter, fill, height40, row]}>
                      <Text text="Round Two" color="septenary" bold center medium />
                    </View>
                    <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                      <Input
                        inputStyle={border}
                        value={weightTwo}
                        onChangeText={val => setWeightTwo(val)}
                        placeholder="Enter Weight"
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                  <View style={[fill, row, regularHMargin, justifyContentBetween, { minHeight: 60 }]}>
                    <View style={[alignItemsCenter, fill, height40, row]}>
                      <Text text="Round Three" color="septenary" bold center medium />
                    </View>
                    <View style={[row, fill, border, center, height40, styles.inputModalStyle]}>
                      <Input
                        inputStyle={border}
                        value={weightThree}
                        onChangeText={val => setWeightThree(val)}
                        placeholder="Enter Weight"
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          </View>
          <View style={[row, regularVMargin]}>
            <Button
              color="primary"
              // onPress={onUpdate}
              text="Update"
              style={[regularHMargin, fill, height40, center]}
            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>

      {/*===============================================*/}
      <BottomSheet reff={refRBSheet} h={360}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={[fill, { width: '100%', marginTop: 20 }]}
        >
          <View style={[fill, zeroMargin, zeroPadding]}>
            <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
              <View
                style={[
                  fill,
                  row,
                  regularHMargin,
                  // alignItemsCenter,
                  justifyContentBetween,
                  { minHeight: 60 },
                ]}
              >
                <View style={[alignItemsCenter, fill, height40, row]}>
                  <Text text="Round One" color="septenary" bold center medium />
                </View>

                <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                  <Input
                    inputStyle={border}
                    value={reps}
                    onChangeText={val => setReps(val)}
                    placeholder="Enter Reps"
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            {showModalRepsTwo && (
              <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                <View
                  style={[
                    fill,
                    row,
                    regularHMargin,
                    // alignItemsCenter,
                    justifyContentBetween,
                    { minHeight: 60 },
                  ]}
                >
                  <View style={[alignItemsCenter, fill, height40, row]}>
                    <Text text="Round Two" color="septenary" bold center medium />
                  </View>
                  <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                    <Input
                      inputStyle={border}
                      value={repsTwo}
                      onChangeText={val => setRepsTwo(val)}
                      placeholder="Enter Reps"
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            {showModalRepsThree && (
              <>
                <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                  <View
                    style={[
                      fill,
                      row,
                      regularHMargin,
                      // alignItemsCenter,
                      justifyContentBetween,
                      { minHeight: 60 },
                    ]}
                  >
                    <View style={[alignItemsCenter, fill, height40, row]}>
                      <Text text="Round Two" color="septenary" bold center medium />
                    </View>
                    <View style={[border, row, center, fill, height40, styles.inputModalStyle]}>
                      <Input
                        inputStyle={border}
                        value={repsTwo}
                        onChangeText={val => setRepsTwo(val)}
                        placeholder="Enter Reps"
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={fill} onPress={() => Keyboard.dismiss()}>
                  <View
                    style={[
                      fill,
                      row,
                      regularHMargin,
                      // alignItemsCenter,
                      justifyContentBetween,
                      { minHeight: 60 },
                    ]}
                  >
                    <View style={[alignItemsCenter, fill, height40, row]}>
                      <Text text="Round Three" color="septenary" bold center medium />
                    </View>
                    <View style={[row, fill, border, center, height40, styles.inputModalStyle]}>
                      <Input
                        inputStyle={border}
                        value={repsThree}
                        onChangeText={val => setRepsThree(val)}
                        placeholder="Enter Reps"
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          </View>
          <View style={[row, regularVMargin]}>
            <Button
              color="primary"
              text="Update"
              style={[regularHMargin, fill, height40, center]}

            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>

      {/*===============================================*/}
      <BottomSheet reff={refRBSheetDescription} h={400}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[fill, { width: '100%', marginTop: 20 }]}
        >
          <View style={[center, regularHMargin]}>
            <Text text={'No Description is available!'} />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>

      {/*===============================================*/}
      <Modal
        transparent={true}
        animationType="slide"
        visible={openModal}
        onBackButtonPress={() => setOpenModal(!openModal)}
        style={[fill, zeroMargin, halfOpacityBg]}
      >
        <TouchableOpacity style={fillHalf} onPress={() => setOpenModal(!openModal)} />
        <View
          style={[justifyContentStart, alignItemsCenter, secondaryBg, topLRBorderRadius20, fill4x]}
        >
          <View style={[regularVMargin, styles.lineStyle]} />
          <View style={[row, center]}>
            {/* <SetsComponents colors={['#f19a38', '#f7df58']} text={'Super Sets'} /> */}
          </View>
          <View style={[regularHMargin, regularVMargin]}>
            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Perform two consecutive exercises with no rest in between.'}
            />

            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Begin rest when second exercise is Complete.'}
            />
          </View>
          <View style={[regularHMargin, regularVMargin]}>
            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Perform three consecutive exercises with no rest in between.'}
            />

            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Begin rest when the third exercise is complete.'}
            />
          </View>


          <View style={[regularHMargin, regularVMargin]}>
            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={
                'Perform a round of the exercise with a certain weight, then reduce the weight to complete another round for more reps without resting immediately after. '
              }
            />

            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Once both rounds of reps are complete, then begin your rest.'}
            />
          </View>


          <View style={[regularHMargin, regularVMargin]}>
            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={
                'Perform a round of the exercise with a certain weight, then reduce the weight to complete another round for more reps, then complete a third round without resting immediately after. '
              }
            />

            <Text
              style={smallVMargin}
              medium
              color="septenary"
              text={'Once all three rounds of reps are complete, then begin your rest.'}
            />
          </View>


          <ScrollView style={fillGrow} showsVerticalScrollIndicator={false}>

            <View style={justifyContentCenter}>
              <View style={[row, fill, regularVMargin]}>
                <Text
                  regularTitle
                  color="quinary"
                  text='name'
                />
              </View>
              <View style={center}>
                <Image
                  source={{
                    uri: ''
                  }}
                  style={styles.modalImageStyle}
                />
              </View>
            </View>
            <View style={[row, fill, regularVMargin]}>
              <Text
                regularTitle
                color="quinary"
                text={`1. ${'exercise.name'}`}
              />
            </View>
            <View style={center}>
              <Image
                source={{
                  uri: ''
                }}
                style={styles.modalImageStyle}
              />
            </View>

            <View style={[fill, row, center, regularVMargin]}>
              <View style={fillOnePoint5} />
              <LinearGradient
                start={startSocial}
                end={endSocial}
                colors={['#fa201b', '#fe5b06']}
                style={[fill2x, punchBg, center, row, borderR10, height40, tiny2xHPadding]}
              >
                <Text
                  large
                  color="secondary"
                  bold
                  text="Got it"
                  onPress={() => setOpenModal(!openModal)}
                />
              </LinearGradient>
              <View style={fillOnePoint5} />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/*===============================================*/}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  doneWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 20,
    height: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  lineStyle: { borderWidth: 1, width: 40, height: 1 },
  inputModalStyle: {
    paddingHorizontal: 8,
    borderRadius: 6,
    borderColor: Colors.nobel,
  },
  modalButton: { height: 50 },
  inputStyle: { height: 50, backgroundColor: '#f5f5f5' },
  modalCrossIcon: { margin: 10 },
  buttonWrapper: {
  },
  modalImageStyle: {
    borderRadius: 20,
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  leftIconStyle: {
    left: 20,
    zIndex: 22,
    top: 0,
    position: 'absolute',
  },
  leftImageStyle: { width: 30, height: 30, resizeMode: 'contain' },
  timerStyle: { height: 30 },
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

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen);


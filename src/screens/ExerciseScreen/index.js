import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Text,
  SetButton,
  VideoExercise,
  FatExerciseButton,
  FatExerciseIconButton,
  FatGradientIconButton,
  RestContainer,
  BottomSheet,
  StaticTimer,
  InputField,
  Button,
  ModalInput,
} from '../../components';
import { Layout, Global, Gutters, Images, Colors } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {
  getAllSessionRequest,
  repsWeightRequest,
  setDoneRequest,
} from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ExerciseScreen = props => {
  const { navigation, route, repsWeightState, exerciseObj, selectedSession } = props;

  let refDescription = useRef('');
  let refWeight = useRef('');
  let refReps = useRef('');
  let refModal = useRef('');

  const [videoLoader, setVideoLoader] = useState(false);
  const [active, setActive] = useState(0);
  const [params, setParms] = useState({});
  const [startTimer, setStartTimer] = useState(false);
  const [timmer, setTimmer] = useState(false);
  // Reps state
  const [repsState, setReps] = useState('');
  const [repsTwo, setRepsTwo] = useState('');
  const [repsThree, setRepsThree] = useState('');
  const [showModalRepsTwo, setShowModalRepsTwo] = useState(false);
  const [showModalRepsThree, setShowModalRepsThree] = useState(false);
  // Weight state
  const [weightState, setWeight] = useState('');
  const [weightTwo, setWeightTwo] = useState('');
  const [weightThree, setWeightThree] = useState('');
  const [showModalWeightTwo, setShowModalWeightTwo] = useState(false);
  const [showModalWeightThree, setShowModalWeightThree] = useState(false);

  // change color state
  const [repsColor, setRepsColor] = useState(false);
  const [weightColor, setWeightColor] = useState(false);
  const [increment, setIncrement] = useState(1);

  const [activeSet, setActiveSet] = useState(0);
  const [modal, setModal] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hours, setHours] = useState(0);

  let deviceHeight = Dimensions.get('window').height;

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (repsWeightState?.set_type?.toLowerCase() === 'ss') {
  //       setModal('ss')
  //       refModal.current.open()
  //     }
  //     if (repsWeightState?.set_type?.toLowerCase() === 'gs') {
  //       setModal('gs')
  //       refModal.current.open()
  //     }
  //     if (repsWeightState?.set_type?.toLowerCase() === 'ds') {
  //       setModal('ds')
  //       refModal.current.open()
  //     }
  //     if (repsWeightState?.set_type?.toLowerCase() === 'tds') {
  //       setModal('tds')
  //       refModal.current.open()
  //     }
  //     if (repsWeightState?.set_type?.toLowerCase() === 'ct') {
  //       setModal('ct')
  //       refModal.current.open()
  //     }
  //     if (repsWeightState?.set_type?.toLowerCase() === 'r') {
  //       setModal(null)
  //     }
  //   }, 500);
  // }, [repsWeightState]);

  const checkModalType = param => {
    switch (param) {
      case 'ss':
        return <SetsComponents colors={['#f19a38', '#f7df58']} text={'Super Sets'} />;
      case 'gs':
        return <SetsComponents colors={['#60d937', '#60d937']} text={'Giant Sets'} />;
      case 'ds':
        return <SetsComponents colors={['#60d937', '#60d937']} text={'Drop Sets'} />;
      case 'tds':
        return <SetsComponents colors={['#ed220d', '#ed220d']} text={'Triple Drop Sets'} />;
      case 'ct':
        return <SetsComponents colors={['#f19a38', '#f7df58']} text={'Circuit Training'} />;
      default:
        break;
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // const [findFirstNotDoneSet] = exerciseObj?.sets?.filter(item => !item?.done);
      // if (findFirstNotDoneSet !== undefined) {
      const setId = selectedSession[0]?.sets[0]?.id;
      props.repsWeightRequest(setId, null, null);
      // }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route) {
      setParms(route.params);
    }
  }, [route]);

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
    alignItemsStart,
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
    borderAlto,
  } = Global;
  const {
    zeroMargin,
    zeroPadding,
    tinyHPadding,
    tinyVPadding,
    smallVMargin,
    smallHMargin,
    largeTPadding,
    largeBPadding,
    smallHPadding,
    regularHMargin,
    regularVMargin,
    tiny2xHPadding,
  } = Gutters;

  const startSocial = { x: 0, y: 0 };
  const endSocial = { x: 1, y: 0 };

  const updateReps = () => {
    setRepsColor(true);
    refReps.current.close();
    const id = repsWeightState.id;
    const reps = `${repsState}${showModalRepsTwo ? '/' : ''}${
      showModalRepsThree ? '/' : ''
    }${repsTwo}${showModalRepsThree ? '/' : ''}${repsThree}`;
    const dd = 'reps';
    props.repsWeightRequest(id, reps, dd);
    setReps('');
    setRepsTwo('');
    setRepsThree('');
  };

  const updateWeight = () => {
    setWeightColor(true);
    refWeight.current.close();
    const id = repsWeightState.id;
    const weight = `${weightState}${showModalWeightTwo ? '/' : ''}${
      showModalWeightThree ? '/' : ''
    }${weightTwo}${showModalWeightThree ? '/' : ''}${weightThree}`;
    const dd = 'weight';
    props.repsWeightRequest(id, weight, dd);
    setWeight('');
    setWeightTwo('');
    setWeightThree('');
  };

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

  const setsData = (set, i) => {
    setActiveSet(i);
    const id = set.id;
    const individual = null;
    const dd = null;
    props.repsWeightRequest(id, individual, dd);
    setRepsColor(false);
    setWeightColor(false);
  };

  const submitData = dd => {
    const [findFirstNotDoneSet] = exerciseObj.sets.filter(item => !item.done);
    const arrayHowManyDone = dd.sets.filter(countSetsDone => countSetsDone.done);
    const countHowManyDone = arrayHowManyDone.length;
    setIncrement(countHowManyDone + 1);

    if (countHowManyDone === exerciseObj.sets.length - 1) {
      props.repsWeightRequest(findFirstNotDoneSet.id, true, true);
      props.setDoneRequest(dd.id);
    } else {
      props.repsWeightRequest(findFirstNotDoneSet.id, true, true);
    }
  };

  const selectExercise = (item, i) => {
    setActive(i);
    props.repsWeightRequest(item?.sets[0]?.id, null, null);
    setTimmer(false);
    if (repsWeightState?.set_type?.toLowerCase() === 'ss') {
      setModal('ss');
      refModal.current.open();
    }
    if (repsWeightState?.set_type?.toLowerCase() === 'gs') {
      setModal('gs');
      refModal.current.open();
    }
    if (repsWeightState?.set_type?.toLowerCase() === 'ds') {
      setModal('ds');
      refModal.current.open();
    }
    if (repsWeightState?.set_type?.toLowerCase() === 'tds') {
      setModal('tds');
      refModal.current.open();
    }
    if (repsWeightState?.set_type?.toLowerCase() === 'ct') {
      setModal('ct');
      refModal.current.open();
    }
    if (repsWeightState?.set_type?.toLowerCase() === 'r') {
      setModal(null);
    }
  };

  return (
    <SafeAreaView style={[fill, { backgroundColor: '#F2F2F2' }]}>
      <View style={[row, alignItemsCenter, justifyContentCenter, smallVMargin, regularHMargin]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftIconStyle}>
          <Image style={styles.leftImageStyle} source={Images.backArrow} />
        </TouchableOpacity>
        <View style={[row, alignItemsEnd, styles.timerStyle]}>
          {/* <StaticTimer
            startTimer={startTimer}
            minutes={minutes}
            setMinutes={setMinutes}
            seconds={seconds}
            setSeconds={setSeconds}
            hours={hours}
            setHours={setHours}
          /> */}
        </View>
        <View />
      </View>
      <View style={[row, center, secondaryBg]}>
        <ScrollView
          horizontal
          contentContainerStyle={[
            fillGrow,
            alignItemsEnd,
            { height: 80, backgroundColor: '#F2F2F2' },
          ]}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        >
          <View style={[row, alignItemsCenter, secondaryBg, { height: 70 }]}>
            {selectedSession &&
              selectedSession?.map((item, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectExercise(item, i)}
                    style={[
                      row,
                      center,
                      smallHPadding,
                      {
                        minHeight: active === i ? 80 : 60,
                        borderRadius: active === i ? 8 : 10,
                        marginHorizontal: active === i ? 0 : 2,
                        backgroundColor: active === i ? 'white' : '#F2F2F2',
                      },
                    ]}
                  >
                    {item?.done ? (
                      <View style={styles.doneWrapper}>
                        <Image source={Images.iconDoneProgram} style={styles.imageWrapper} />
                      </View>
                    ) : null}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: 100,
                      }}
                    >
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 15,
                          textAlign: 'center',
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={3}
                      >
                        {`${i + 1}. ${item?.exercise?.name}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </View>
      {selectedSession &&
        selectedSession?.map((item, index) => {
          if (active === index) {
            return (
              <View style={[fill]}>
                <View style={[row, center, { backgroundColor: '#F2F2F2' }]}>
                  <VideoExercise
                    videoUrl={{
                      uri: item?.exercise?.video,
                    }}
                    onLoadStart={() => setVideoLoader(true)}
                    onLoad={() => setVideoLoader(false)}
                  />
                  {videoLoader && (
                    <View style={{ left: '45%', top: '45%', position: 'absolute' }}>
                      <ActivityIndicator size="large" color="White" />
                    </View>
                  )}
                </View>
                {repsWeightState?.set_type?.toLowerCase() === 'cr' ? (
                  props.loader ? (
                    <View style={[secondaryBg, { height: 50, justifyContent: 'center' }]}>
                      <ActivityIndicator size="small" color="green" />
                    </View>
                  ) : (
                    <View
                      style={[row, justifyContentCenter, alignItemsEnd, largeTPadding, secondaryBg]}
                    >
                      <Text text={route?.params?.item?.cardio_length} largeTitle bold />
                      <Text text="minutes" medium bold style={{ lineHeight: 34 }} />
                    </View>
                  )
                ) : (
                  <>
                    {repsWeightState?.set_type?.toLowerCase() === modal ? (
                      modal && props.loader ? (
                        <View style={[secondaryBg, { height: 50, justifyContent: 'center' }]}>
                          <ActivityIndicator size="small" color="green" />
                        </View>
                      ) : (
                        <View style={[secondaryBg, { height: 50, justifyContent: 'flex-end' }]}>
                          {checkModalType(modal)}
                        </View>
                      )
                    ) : null}

                    <View
                      style={[
                        row,
                        alignItemsCenter,
                        secondaryBg,
                        { height: 60, paddingHorizontal: 10 },
                      ]}
                    >
                      <ScrollView
                        horizontal
                        contentContainerStyle={fillGrow}
                        showsHorizontalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                      >
                        {item?.sets?.map((set, i) => (
                          <SetButton
                            key={i}
                            item={set}
                            index={i}
                            onPress={() => setsData(set, i)}
                            mainContainer={{ marginHorizontal: 5 }}
                            bg={repsWeightState?.id === set?.id && increment && '#d3d3d3'}
                            repsWeightState={repsWeightState}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}
                <View style={[fill, secondaryBg]}>
                  <ScrollView contentContainerStyle={[fillGrow]}>
                    {repsWeightState?.set_type?.toLowerCase() === 'cr' ? null : (
                      <View style={[row, tinyHPadding]}>
                        <FatExerciseButton
                          reps
                          buttonLabel="Reps"
                          text={repsWeightState?.reps}
                          onPress={() => {
                            refReps.current.open();
                            setShowModalRepsTwo(
                              repsWeightState && repsWeightState?.set_type?.toLowerCase() === 'ds'
                            );
                            setShowModalRepsThree(
                              repsWeightState && repsWeightState?.set_type?.toLowerCase() === 'tds'
                            );
                          }}
                          loadingReps={props.loader}
                          repsColor={repsColor}
                          repsWeightState={repsWeightState}
                          disabled={props.loader}
                        />
                        <FatExerciseButton
                          weight
                          buttonLabel="Weight"
                          text={repsWeightState?.weight}
                          onPress={() => {
                            refWeight.current.open();
                            setShowModalWeightTwo(
                              repsWeightState && repsWeightState?.set_type?.toLowerCase() === 'ds'
                            );
                            setShowModalWeightThree(
                              repsWeightState && repsWeightState?.set_type?.toLowerCase() === 'tds'
                            );
                          }}
                          loadingWeight={props.loader}
                          weightColor={weightColor}
                          repsWeightState={repsWeightState}
                          disabled={props.loader}
                        />
                      </View>
                    )}
                    <View style={[row, tinyHPadding, tinyVPadding]}>
                      <FatExerciseIconButton
                        buttonText="Exercise Description"
                        buttonIcon={Images.detailIcon}
                        onPress={() => refDescription.current.open()}
                      />
                      <FatExerciseIconButton
                        buttonText="Swap Exercise"
                        buttonIcon={Images.iconSwap}
                      />
                      <FatGradientIconButton
                        buttonText={
                          repsWeightState?.set_type?.toLowerCase() === 'cr'
                            ? 'Complete'
                            : item?.sets[item?.sets.length - 1].id &&
                              item?.sets[item?.sets.length - 1].done
                            ? 'Done'
                            : 'Done, Start Rest'
                        }
                        buttonIcon={Images.iconDoneStartRest}
                        colorsGradient={['#3180BD', '#6EC2FA']}
                        colorsGradientDisable={['#d3d3d3', '#838383']}
                        disabled={
                          timmer ||
                          (item?.sets[item?.sets.length - 1].id &&
                            item?.sets[item?.sets.length - 1].done)
                        }
                        onPress={() => {
                          if (item.sets[activeSet].done) {
                            setTimmer(true);
                          } else {
                            setTimmer(false);
                          }
                          submitData(item);
                        }}
                      />
                    </View>
                    <RestContainer
                      upNext={'next'}
                      startRest={timmer}
                      activeSet={activeSet}
                      onPress={() => {
                        setStartTimer(false);
                        setTimmer(false);
                        Alert.alert('App is in Working please hold!');
                      }}
                      onFinish={() => setTimmer(false)}
                    />
                  </ScrollView>
                </View>
              </View>
            );
          }
        })}

      {/*===============================================*/}

      <BottomSheet reff={refDescription} h={400}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[fill, { width: '100%', marginTop: 20 }]}
        >
          <View style={[center, regularHMargin]}>
            {exerciseObj?.exercise?.description ? (
              <Text text={exerciseObj?.exercise?.description} />
            ) : (
              <Text text={'No Description is available!'} />
            )}
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>

      {/*===============================================*/}
      <BottomSheet reff={refReps} h={360}>
        <View style={[fill, regularHMargin, regularVMargin]}>
          <ModalInput
            text="Round one"
            value={repsState}
            onChangeText={val => setReps(val)}
            placeholder="Enter Reps"
            keyboardType="numeric"
          />
          {showModalRepsTwo && (
            <ModalInput
              text="Round Two"
              value={repsTwo}
              onChangeText={val => setRepsTwo(val)}
              placeholder="Enter Reps"
              keyboardType="numeric"
            />
          )}
          {showModalRepsThree && (
            <>
              <ModalInput
                text="Round Two"
                value={repsTwo}
                onChangeText={val => setRepsTwo(val)}
                placeholder="Enter Reps"
                keyboardType="numeric"
              />
              <ModalInput
                text="Round Three"
                value={repsThree}
                onChangeText={val => setRepsThree(val)}
                placeholder="Enter Reps"
                keyboardType="numeric"
              />
            </>
          )}
        </View>
        <View style={[row, regularVMargin]}>
          <Button
            color="primary"
            onPress={updateReps}
            text="Update"
            style={[regularHMargin, fill, height40, center]}
            loading={props.loader}
            disabled={
              !repsState ||
              !repsState.length > 0 ||
              (showModalRepsTwo && !repsTwo) ||
              (showModalRepsTwo && !repsTwo.length > 0) ||
              (showModalRepsThree && !repsThree) ||
              (showModalRepsThree && !repsThree.length > 0)
            }
          />
        </View>
      </BottomSheet>
      {/*===============================================*/}
      <BottomSheet reff={refWeight} h={360}>
        <View style={[fill, regularHMargin, regularVMargin]}>
          <ModalInput
            text="Round one"
            value={weightState}
            onChangeText={val => setWeight(val)}
            placeholder="Enter Weight"
            keyboardType="numeric"
          />
          {showModalWeightTwo && (
            <ModalInput
              text="Round Two"
              value={weightTwo}
              onChangeText={val => setWeightTwo(val)}
              placeholder="Enter Weight"
              keyboardType="numeric"
            />
          )}
          {showModalWeightThree && (
            <>
              <ModalInput
                text="Round Two"
                value={weightTwo}
                onChangeText={val => setWeightTwo(val)}
                placeholder="Enter Weight"
                keyboardType="numeric"
              />
              <ModalInput
                text="Round Three"
                value={weightThree}
                onChangeText={val => setWeightThree(val)}
                placeholder="Enter Weight"
                keyboardType="numeric"
              />
            </>
          )}
        </View>
        <View style={[row, regularVMargin]}>
          <Button
            color="primary"
            onPress={updateWeight}
            text="Update"
            style={[regularHMargin, fill, height40, center]}
            loading={props.loader}
            disabled={
              !weightState ||
              !weightState.length > 0 ||
              (showModalWeightTwo && !weightTwo) ||
              (showModalWeightTwo && !weightTwo.length > 0) ||
              (showModalWeightThree && !weightThree) ||
              (showModalWeightThree && !weightThree.length > 0)
            }
          />
        </View>
      </BottomSheet>
      {/*===============================================*/}
      <BottomSheet reff={refModal} h={deviceHeight - 100}>
        <View style={[justifyContentStart, alignItemsCenter, fill4x]}>
          <View style={[row, center, { marginTop: 20 }]}>{checkModalType(modal)}</View>
          <>
            {modal === 'ss' ? (
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
            ) : null}
          </>
          <>
            {modal === 'gs' ? (
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
            ) : null}
          </>
          <>
            {modal === 'ds' ? (
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
            ) : null}
          </>
          <>
            {modal === 'tds' ? (
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
            ) : null}
          </>

          <ScrollView style={fillGrow} showsVerticalScrollIndicator={false}>
            {modal === 'ss' || modal === 'gs' ? (
              <>
                {repsWeightState?.exercises?.map((exercise, index) => {
                  return (
                    <View key={index} style={justifyContentCenter}>
                      <View style={[row, fill, regularVMargin]}>
                        <Text
                          regularTitle
                          color="quinary"
                          text={`${
                            (index + 1 === 1 && 'a') ||
                            (index + 1 === 2 && 'b') ||
                            (index + 1 === 3 && 'c') ||
                            (index + 1 === 4 && 'd')
                          }. ${exercise?.name}`}
                        />
                      </View>
                      <View style={center}>
                        <Image
                          source={{
                            uri: exercise?.pictures[0]?.image_url,
                          }}
                          style={styles.modalImageStyle}
                        />
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                <View style={[row, fill, regularVMargin]}>
                  <Text regularTitle color="quinary" text={`1. ${exerciseObj?.exercise?.name}`} />
                </View>
                <View style={center}>
                  <Image
                    source={{
                      uri: exerciseObj?.exercise?.pictures[0]?.image_url,
                    }}
                    style={styles.modalImageStyle}
                  />
                </View>
              </>
            )}
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
                  onPress={() => refModal.current.close()}
                />
              </LinearGradient>
              <View style={fillOnePoint5} />
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  doneWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
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
  modalImageStyle: {
    borderRadius: 20,
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  leftIconStyle: {
    left: 0,
    zIndex: 22,
    top: '13%',
    position: 'absolute',
  },
  leftImageStyle: { width: 30, height: 30, resizeMode: 'contain' },
  timerStyle: { height: 30 },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 60,
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  repsWeightState: state.programReducer.repsWeight,
  loader: state.programReducer.loader,
  exerciseObj: state.programReducer.exerciseObj,
  selectedSession: state.programReducer.selectedSession,
  nextWorkout: state.programReducer.nextWorkout,

  setDone: state.programReducer.setDone,
});

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  repsWeightRequest: (id, data, dd) => dispatch(repsWeightRequest(id, data, dd)),
  setDoneRequest: id => dispatch(setDoneRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen);

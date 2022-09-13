import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
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
  ModalInput
} from '../../components';
import { Layout, Global, Gutters, Images, Colors } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { getAllSessionRequest, repsWeightRequest } from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ExerciseScreen = props => {
  const {
    navigation,
    route,
    repsWeight,
    exerciseObj,
    selectedSession,
    nextWorkout
  } = props;

  let refDescription = useRef('');
  let refWeight = useRef('');
  let refReps = useRef('');

  const [videoLoader, setVideoLoader] = useState(false);
  const [active, setActive] = useState(0);
  const [params, setParms] = useState({});
  const [startTimer, setStartTimer] = useState(false);
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

  // 
  const [activeSet, setActiveSet] = useState({})


  useEffect(() => {
    if (route) {
      setParms(route.params)
    }
  }, [route])

  console.log('repsWeight: ', repsWeight);
  console.log('activeSet: ', activeSet);

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
    borderAlto
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
    refReps.current.close();

    const id = repsWeight.id
    const reps = `${repsState}${showModalRepsTwo ? '/' : ''}${showModalRepsThree ? '/' : ''}${repsTwo}${showModalRepsThree ? '/' : ''
      }${repsThree}`
    console.log('id, reps', id, reps);
    props.repsWeightRequest(id, reps);
    setReps('');
    setRepsTwo('');
    setRepsThree('');
  };

  const updateWeight = () => {
    refWeight.current.close();
    const id = repsWeight.id
    const weight = `${weightState}${showModalWeightTwo ? '/' : ''}${showModalWeightThree ? '/' : ''}${weightTwo}${showModalWeightThree ? '/' : ''}${weightThree}`
    console.log('id, weight', id, weight);
    props.repsWeightRequest(id, weight);
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

  const setsData = (set) => {
    const id = set.id
    const individual = null
    props.repsWeightRequest(id, individual);
  }
  return (
    <SafeAreaView style={[fill, { backgroundColor: '#F2F2F2' }]}>
      <View style={[row, alignItemsCenter, justifyContentCenter, smallVMargin, regularHMargin]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftIconStyle}>
          <Image style={styles.leftImageStyle} source={Images.backArrow} />
        </TouchableOpacity>
        <View style={[row, alignItemsEnd, styles.timerStyle]}>
          <StaticTimer startTimer={true} />
        </View>
        <View />
      </View>
      <View style={[row, center, secondaryBg]}>
        <ScrollView
          horizontal
          contentContainerStyle={[
            fillGrow,
            alignItemsEnd,
            { height: 80, backgroundColor: '#F2F2F2' }
          ]}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        >
          <View style={[row, alignItemsCenter, secondaryBg, { height: 70 }]}>
            {params?.workouts?.map((item, i) => {
              return (
                <TouchableOpacity
                  onPress={() => setActive(i)}
                  style={[
                    row,
                    center,
                    smallHPadding,
                    {
                      minHeight: active === i ? 80 : 60,
                      borderRadius: active === i ? 8 : 10,
                      marginHorizontal: active === i ? 0 : 2,
                      backgroundColor: active === i ? "white" : '#F2F2F2',
                    }
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
                      width: 100
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
              )
            })}
          </View>
        </ScrollView>
      </View>
      {params?.workouts?.map((item, index) => {
        if (active === index) {
          return (
            <View style={[fill]}>
              <View style={[row, center, { backgroundColor: '#F2F2F2' }]}>
                <VideoExercise
                  videoUrl={{
                    uri: item?.exercise?.video
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

              {true && (
                <View style={[center, secondaryBg, { height: 60 }]}>
                  <SetsComponents colors={['#f19a38', '#f7df58']} text={item.exercise.name} />
                </View>
              )}

              <View style={[row, alignItemsCenter, secondaryBg, { height: 60 }]}>
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
                      onPress={() => setsData(set)}
                      mainContainer={{ marginLeft: 10 }}
                    />
                  )
                  )}
                </ScrollView>
              </View>

              {repsWeight ?
                <View style={[fill, secondaryBg]}>
                  <ScrollView contentContainerStyle={[fillGrow]}>
                    <View style={[row, tinyHPadding]}>
                      <FatExerciseButton
                        reps
                        buttonLabel="Reps"
                        onPress={() => refReps.current.open()}
                        text={repsState}
                      />
                      <FatExerciseButton
                        weight
                        buttonLabel="Weight"
                        onPress={() => refWeight.current.open()}
                        isDone={weightState || weightTwo || weightThree}
                      />
                    </View>

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
                          true
                            ? 'Done'
                            : 'Done, Start Rest'
                        }
                        buttonIcon={Images.iconDoneStartRest}
                        colorsGradient={['#3180BD', '#6EC2FA']}
                        colorsGradientDisable={['#d3d3d3', '#838383']}
                      />
                    </View>
                    <RestContainer
                      upNext={'next'}
                      showBar={false}
                    // onPress={() => setStartTimer(false)}
                    />
                  </ScrollView>
                </View>
                : null}
            </View>
          )
        }
      })}
      {/*===============================================*/}
      <BottomSheet reff={refReps} h={360}>
        <View style={[fill, regularHMargin, regularVMargin]}>
          <ModalInput
            text="Round one"
            value={repsState}
            onChangeText={(val) => setReps(val)}
            placeholder="Enter Reps"
            keyboardType="numeric"
          />
          {showModalRepsTwo &&
            <ModalInput
              text="Round Two"
              value={repsTwo}
              onChangeText={(val) => setRepsTwo(val)}
              placeholder="Enter Reps"
              keyboardType="numeric"
            />
          }
          {showModalRepsThree &&
            <ModalInput
              text="Round Three"
              value={repsThree}
              onChangeText={(val) => setRepsThree(val)}
              placeholder="Enter Reps"
              keyboardType="numeric"
            />
          }
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
            onChangeText={(val) => setWeight(val)}
            placeholder="Enter Weight"
            keyboardType="numeric"
          />
          {showModalWeightTwo &&
            <ModalInput
              text="Round Two"
              value={weightTwo}
              onChangeText={(val) => setWeightTwo(val)}
              placeholder="Enter Weight"
              keyboardType="numeric"
            />
          }
          {showModalWeightThree &&
            <ModalInput
              text="Round Three"
              value={weightThree}
              onChangeText={(val) => setWeightThree(val)}
              placeholder="Enter Weight"
              keyboardType="numeric"
            />
          }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  doneWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3
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
  getAllSessions: state.programReducer.getAllSessions,
  repsWeight: state.programReducer.repsWeight,
  loader: state.programReducer.loader,
  exerciseObj: state.programReducer.exerciseObj,
  selectedSession: state.programReducer.selectedSession,
  nextWorkout: state.programReducer.nextWorkout,
  // exerciseSwapped: state.sessions && state.sessions.exerciseSwapped,
  // loadingAllSession: state.sessions && state.sessions.loadingAllSession,
  // saveSwipeState: state.sessions && state.sessions.saveSwipeState,
  // resetSwipeAction: state.sessions && state.sessions.resetSwipeAction,
});

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: (data) => dispatch(getAllSessionRequest(data)),
  repsWeightRequest: (id, data) => dispatch(repsWeightRequest(id, data)),
  // pickSessionAction: (data) => dispatch(pickSession(data)),
  // saveSwipeDateAction: () => dispatch(saveSwipeDateAction()),
  // resetSwipeDateAction: () => dispatch(resetSwipeDateAction()),
  // getAllSwapExercise: () => dispatch(allSwapExercise()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen);


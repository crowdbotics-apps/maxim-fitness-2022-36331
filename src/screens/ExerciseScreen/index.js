import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
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
  StaticTimer
} from '../../components';
import { Layout, Global, Gutters, Images, Colors } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { getAllSessionRequest } from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ExerciseScreen = props => {
  const { navigation, route } = props;
  console.log('route: ', route);
  let refDescription = useRef('');
  let refWeight = useRef('');
  const [videoLoader, setVideoLoader] = useState(false);
  const [active, setActive] = useState(0);
  const [params, setParms] = useState({});

  useEffect(() => {
    if (route) {
      setParms(route.params)
    }
  }, [route])

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

              {false && (
                <View style={[center, secondaryBg, { height: 60 }]}>
                  <SetsComponents colors={['#f19a38', '#f7df58']} text={'Super Sets'} />
                </View>
              )}

              <View style={[row, alignItemsCenter, secondaryBg, { height: 60 }]}>
                <ScrollView
                  horizontal
                  contentContainerStyle={fillGrow}
                  showsHorizontalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                >
                  {item?.sets?.map((item, i) => {
                    return (
                      <TouchableOpacity style={[height40, { marginHorizontal: 10, borderRadius: 10 }]} key={i}>
                        <SetButton item={item} index={i} />
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>

              <View style={[fill, secondaryBg]}>
                <ScrollView contentContainerStyle={[fillGrow]}>
                  <View style={[row, tinyHPadding]}>
                    <FatExerciseButton
                      reps
                      buttonLabel="Reps"
                    />
                    <FatExerciseButton
                      weight
                      buttonLabel="Weight"
                      onPress={() => refWeight.current.open()}
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
                  <RestContainer upNext={'next'} showBar={false} />
                </ScrollView>
              </View>
            </View>
          )
        }
      })

      }
      {/*===============================================*/}
      <BottomSheet reff={refDescription} h={400}>
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
      <BottomSheet reff={refWeight} h={400}>
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


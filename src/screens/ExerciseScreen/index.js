import React, { useState, useEffect, useRef } from "react"
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
  TouchableWithoutFeedback
} from "react-native"
import {
  Text,
  SetButton,
  VideoExercise,
  FatExerciseButton,
  FatExerciseIconButton,
  FatGradientIconButton,
  RestContainer,
  BottomSheet,
  InputField,
  Button,
  ModalInput,
  StaticTimer
} from "../../components"
import { Layout, Global, Gutters, Images, Colors } from "../../theme"
import LinearGradient from "react-native-linear-gradient"
import VideoPlayer from "../../components/VideoPlayer"
import {
  getAllSessionRequest,
  repsWeightRequest,
  repsCustomWeightRequest,
  setDoneRequest,
  customSetDoneRequest,
  sessionDone,
  allSwapExercise,
  allSwapCustomExercise,
  customSessionDone,
  setExerciseTitle,
  getCustomWorkoutDataRequest,
  getCSVWorkoutDataRequest
} from "../../ScreenRedux/programServices"
import { connect } from "react-redux"
import { useIsFocused, useRoute } from "@react-navigation/native"
import { sortExercises } from "../../utils/utils"

const ExerciseScreen = props => {
  const {
    navigation,
    repsWeightState,
    isCustom,
    setExerciseTitle,
    getCSVWorkoutDataRequest,
    getCustomWorkoutDataRequest,
    workoutData,
    setDoneSuccess
  } = props
  const route = useRoute()
  let refDescription = useRef("")
  let refWeight = useRef("")
  let refReps = useRef("")
  let refModal = useRef("")

  const [videoLoader, setVideoLoader] = useState(false)
  const [mainActive, setMainActive] = useState(0)
  const [active, setActive] = useState(0)
  const [params, setParms] = useState({})
  const [startTimer, setStartTimer] = useState(false)
  const [timmer, setTimmer] = useState(false)
  // Reps state
  const [repsState, setReps] = useState("")
  const [repsTwo, setRepsTwo] = useState("")
  const [repsThree, setRepsThree] = useState("")
  const [showModalRepsTwo, setShowModalRepsTwo] = useState(false)
  const [showModalRepsThree, setShowModalRepsThree] = useState(false)
  // Weight state
  const [weightState, setWeight] = useState("")
  const [weightTwo, setWeightTwo] = useState("")
  const [weightThree, setWeightThree] = useState("")
  const [showModalWeightTwo, setShowModalWeightTwo] = useState(false)
  const [showModalWeightThree, setShowModalWeightThree] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState([])

  // change color state
  const [repsColor, setRepsColor] = useState(false)
  const [weightColor, setWeightColor] = useState(false)
  const [increment, setIncrement] = useState(1)

  const [activeSet, setActiveSet] = useState(0)
  const [modal, setModal] = useState(false)

  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [hours, setHours] = useState(0)

  let deviceHeight = Dimensions.get("window").height

  useEffect(() => {
    setActiveSet(0)
    setTimeout(() => {
      if (repsWeightState?.set_type?.toLowerCase() === "ss") {
        setModal("ss")
      }
      if (repsWeightState?.set_type?.toLowerCase() === "gs") {
        setModal("gs")
      }
      if (repsWeightState?.set_type?.toLowerCase() === "ds") {
        setModal("ds")
      }
      if (repsWeightState?.set_type?.toLowerCase() === "tds") {
        setModal("tds")
      }
      if (repsWeightState?.set_type?.toLowerCase() === "ct") {
        setModal("ct")
      }
      if (repsWeightState?.set_type?.toLowerCase() === "r") {
        setModal('r')
      }
    }, 500)
  }, [])

  const checkModalType = param => {

    switch (param) {
      case "ss":
        return (
          <SetsComponents colors={["#f19a38", "#f7df58"]} text={"Super Sets"} />
        )
      case "gs":
        return (
          <SetsComponents colors={["#60d937", "#60d937"]} text={"Giant Sets"} />
        )
      case "ds":
        return (
          <SetsComponents colors={["#60d937", "#60d937"]} text={"Drop Sets"} />
        )
      case "tds":
        return (
          <SetsComponents
            colors={["#ed220d", "#ed220d"]}
            text={"Triple Drop Sets"}
          />
        )
      case "ct":
        return (
          <SetsComponents
            colors={["#f19a38", "#f7df58"]}
            text={"Circuit Training"}
          />
        )
      case "r":
        return (
          <SetsComponents
            colors={["#60d937", "#60d937"]}
            text={"Single Sets"}
          />
        )
      default:
        break
    }
  }
  const onFocus = useIsFocused()
  useEffect(() => {
    setActiveSet(0)
    async function getAllData() {
      setParms(route?.params)
      if (isCustom) {

        await getCustomWorkoutDataRequest(route?.params?.item?.id)
      } else {
        await getCSVWorkoutDataRequest(route?.params?.item?.id)
      }
      await getData()
      setExerciseTitle('')
      setSelectedExercise(workoutData?.workouts?.[0])
    }
    getAllData()
  }, [onFocus, route])

  useEffect(() => {
    setSelectedExercise(workoutData?.workouts?.[mainActive])

  }, [workoutData])

  const getData = async () => {

    if (isCustom) {
      await getCustomWorkoutDataRequest(route?.params?.item?.id)
      const setId = await sortExercises(workoutData?.workouts?.[mainActive]?.exercises, workoutData?.workouts?.[mainActive]?.exercises_order ? selectedExercise?.exercises_order : null)?.[active]?.sets?.[activeSet]?.id
      await props.repsCustomWeightRequest(setId, null, null)
    } else {
      await getCSVWorkoutDataRequest(route?.params?.item?.id)
      const setId = workoutData?.workouts?.[mainActive]?.exercises?.[active]?.sets?.[activeSet]?.id
      await props.repsWeightRequest(setId, null, null)

    }

  }

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
    justifyContentBetween
  } = Layout
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
  } = Global
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
    tiny2xHPadding
  } = Gutters

  const startSocial = { x: 0, y: 0 }
  const endSocial = { x: 1, y: 0 }

  const updateReps = () => {
    setRepsColor(true)
    refReps.current.close()
    const id = repsWeightState.id
    const reps = `${repsState}${showModalRepsTwo ? "/" : ""}${showModalRepsThree ? "/" : ""
      }${repsTwo}${showModalRepsThree ? "/" : ""}${repsThree}`
    const dd = "reps"
    if (isCustom) {
      props.repsCustomWeightRequest(id, reps, dd)
    } else {
      props.repsWeightRequest(id, reps, dd)
    }
    setReps("")
    setRepsTwo("")
    setRepsThree("")
  }

  const updateWeight = () => {
    setWeightColor(true)
    refWeight.current.close()
    const id = repsWeightState.id
    const weight = `${weightState}${showModalWeightTwo ? "/" : ""}${showModalWeightThree ? "/" : ""
      }${weightTwo}${showModalWeightThree ? "/" : ""}${weightThree}`
    const dd = "weight"
    if (isCustom) {
      props.repsCustomWeightRequest(id, weight, dd)
    } else {
      props.repsWeightRequest(id, weight, dd)
    }
    setWeight("")
    setWeightTwo("")
    setWeightThree("")
  }

  const SetsComponents = ({ colors, text }) => {
    return (
      <View style={[row, center]}>
        <View style={fill} />
        <LinearGradient
          start={startSocial}
          end={endSocial}
          colors={colors}
          style={[
            fill2x,
            center,
            row,
            borderR10,
            punchBg,
            height40,
            tiny2xHPadding
          ]}
        >
          <Text color="secondary" text={text} large bold center />
        </LinearGradient>
        <View style={fill} />
      </View>
    )
  }

  const setsData = (set, i) => {
    setActiveSet(i)
    const id = set?.id
    const individual = null
    const dd = null
    if (isCustom) {
      props.repsCustomWeightRequest(id, individual, dd)
    } else {
      props.repsWeightRequest(id, individual, dd)
    }
    setRepsColor(false)
    setWeightColor(false)
  }

  const submitData = async (data) => {
    const findSetId = data?.sets[activeSet]
    const allDone = data?.sets?.every(set => set.done)
    const arrayHowManyDone = data?.sets?.filter(
      countSetsDone => countSetsDone.done
    )
    const countHowManyDone = arrayHowManyDone.length

    setIncrement(countHowManyDone + 1)
    if (!allDone) {
      if (!findSetId?.done) {
        const data = {
          activeSet,
          active,
          workoutData: workoutData,
          setTimmer
        }
        if (isCustom) {
          await props.customSetDoneRequest(findSetId.id, data)
        } else {
          await props.setDoneRequest(findSetId.id, data)
        }
        await getData()
      }
    }

    // if (countHowManyDone === exerciseObj.sets.length - 1) {
    //   props.repsWeightRequest(findFirstNotDoneSet.id, true, true);

    //   props.setDoneRequest(dd.id);
    // } else {
    //   props.repsWeightRequest(findFirstNotDoneSet.id, true, true);
    // }
  }

  const selectExercise = (item, i) => {
    setActive(i)
    setActiveSet(0)
    if (isCustom) {
      props.repsCustomWeightRequest(item?.sets?.[activeSet]?.id, null, null, callBack)
    } else {
      props.repsWeightRequest(item?.sets?.[activeSet]?.id, null, null, callBack)
    }
  }

  const callBack = item => {
    setTimmer(false)
    if (item?.set_type?.toLowerCase() === "ss") {
      setModal("ss")
      // refModal.current.open()
    }
    if (item?.set_type?.toLowerCase() === "gs") {
      setModal("gs")
      // refModal.current.open()
    }
    if (item?.set_type?.toLowerCase() === "ds") {
      setModal("ds")
      // refModal.current.open()
    }
    if (item?.set_type?.toLowerCase() === "tds") {
      setModal("tds")
      // refModal.current.open()
    }
    if (item?.set_type?.toLowerCase() === "ct") {
      setModal("ct")
      // refModal.current.open()
    }
    if (item?.set_type?.toLowerCase() === "r") {
      setModal("r")
      // refModal.current.open()
    }
  }

  /**
   * Handles the swipe functionality.
   */
  const swipeFunc = () => {
    const exerciseTypeId =
      workoutData?.workouts?.[mainActive]?.exercises?.[active]?.exercise_type?.id
    if (isCustom) {
      props.allSwapCustomExercise(exerciseTypeId)
      navigation.navigate("SwapExerciseScreen", {
        ScreenData: {
          data: workoutData?.workouts?.[mainActive]?.exercises?.[active],
          date_time: workoutData?.date_time,
          workout: workoutData?.workouts?.[mainActive]?.id,
          custom_workouts_exercise_id: workoutData?.workouts?.[mainActive]?.id,
          workout_id: workoutData?.id
        }
      })
    } else {
      // props.allSwapExercise(workoutData?.workouts?.[active]?.id)
      props.allSwapExercise(workoutData?.workouts?.[mainActive]?.exercises?.[active]?.exercise_type?.id)
      navigation.navigate("SwapExerciseScreen", {
        ScreenData: {
          data: workoutData?.workouts?.[mainActive]?.exercises?.[active],
          date_time: workoutData?.date_time,
          workout: workoutData?.workouts?.[mainActive]?.id,
          custom_workouts_exercise_id: workoutData?.workouts?.[mainActive]?.id,
          workout_id: workoutData?.id
        }
      })
    }
  }

  const screenNavigation = () => {
    navigation.goBack()
    // navigation.navigate("WorkoutCard", {
    //   item: selectedSession,
    //   uppercard: route
    // })
  }

  const checkDoneExcercise = () => {
    const allDone = workoutData?.every(item => item.done === true)
    return allDone
  }
  const sortDataByDoneStatus = data => {
    return data.sort((a, b) => {
      if (a.done === b.done) {
        return 0
      }
      if (a.done) {
        return 1
      }
      return -1
    })
  }

  return (
    <SafeAreaView style={[fill, { backgroundColor: "#F2F2F2" }]}>
      <View
        style={[
          row,
          alignItemsCenter,
          justifyContentCenter,
          smallVMargin,
          regularHMargin
        ]}
      >
        <TouchableOpacity
          disabled={timmer}
          onPress={() => navigation.goBack()}
          style={styles.leftIconStyle}
        >
          <Image style={styles.leftImageStyle} source={Images.backArrow} />
        </TouchableOpacity>
        <View style={[row, alignItemsEnd, styles.timerStyle]}>
          <StaticTimer
            startTimer={startTimer}
            minutes={minutes}
            setMinutes={setMinutes}
            seconds={seconds}
            setSeconds={setSeconds}
            hours={hours}
            setHours={setHours}
          />
        </View>

        <View />
      </View>
      <View style={[row, center, secondaryBg]}>
        <ScrollView
          horizontal
          contentContainerStyle={[
            fillGrow,
            alignItemsEnd,
            { height: 80, backgroundColor: "#F2F2F2" }
          ]}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        >
          <View style={[row, alignItemsCenter, secondaryBg, { height: 70 }]}>
            {workoutData?.workouts?.length ? (
              workoutData.workouts?.map((item, i) => {
                return (
                  <View>
                    <TouchableOpacity
                      // disabled={timmer}
                      onPress={() => {
                        setSelectedExercise(item)
                        setMainActive(i)
                        if (
                          item?.exercises?.[i]?.sets?.[0]?.set_type === "ss" ||
                          item?.exercises?.[i]?.sets?.[0]?.set_type === "gs"
                        ) {
                          selectExercise(item?.exercises?.[i], 0)
                        } else {
                          selectExercise(item?.exercises?.[0], 0)
                        }
                        setTimeout(() => {
                          // if (item?.exercises?.length == 1) {
                          //   refModal
                          //     ?.current?.close()
                          // } else {
                          refModal.current?.open()
                          // }
                        }, 800)
                      }}
                      style={[
                        row,
                        center,
                        smallHPadding,
                        {
                          minHeight: mainActive === i ? 80 : 60,
                          borderRadius: mainActive === i ? 8 : 10,
                          marginHorizontal: mainActive === i ? 0 : 2,
                          backgroundColor:
                            mainActive === i ? "white" : "#F2F2F2"
                        }
                      ]}
                    >
                      {item?.done ? (
                        <View style={styles.doneWrapper}>
                          <Image
                            source={Images.iconDoneProgram}
                            style={styles.imageWrapper}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: 100
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 15,
                            textAlign: "center"
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={3}
                        >
                          {`${i + 1}. ${item?.name || item?.exercises?.[active]?.name
                            }`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              })
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </View>
      {selectedExercise?.length !== 0 &&
        (sortExercises(selectedExercise?.exercises, selectedExercise?.exercises_order ? selectedExercise?.exercises_order : null)?.[0]?.sets?.[0]?.set_type === "ss" ||
          sortExercises(selectedExercise?.exercises, selectedExercise?.exercises_order ? selectedExercise?.exercises_order : null)?.[0]?.sets?.[0]?.set_type === "gs") && (
          <View style={[row, center, secondaryBg]}>
            <ScrollView
              horizontal
              contentContainerStyle={[
                fillGrow,
                alignItemsEnd,
                { height: 80, backgroundColor: "#F2F2F2" }
              ]}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
            >
              <View
                style={[row, alignItemsCenter, secondaryBg, { height: 70 }]}
              >
                {selectedExercise?.length !== 0
                  ? sortExercises(selectedExercise?.exercises, selectedExercise?.exercises_order ? selectedExercise?.exercises_order : null)?.map((list, i) => (
                    <TouchableOpacity
                      // disabled={timmer}
                      onPress={() => selectExercise(list, i)}
                      style={[
                        row,
                        center,
                        smallHPadding,
                        {
                          minHeight: active === i ? 80 : 60,
                          borderRadius: active === i ? 8 : 10,
                          marginHorizontal: active === i ? 0 : 2,
                          backgroundColor: active === i ? "white" : "#F2F2F2"
                        }
                      ]}
                    >
                      {list?.done ? (
                        <View style={styles.doneWrapper}>
                          <Image
                            source={Images.iconDoneProgram}
                            style={styles.imageWrapper}
                          />
                        </View>
                      ) : null}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: 100
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 15,
                            textAlign: "center"
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={3}
                        >
                          {`${i + 1}. ${list?.name}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                  : null}
              </View>
            </ScrollView>
          </View>
        )}
      {/*===============================================*/}

      {selectedExercise?.length != 0 ? (
        selectedExercise?.exercises?.map((item, index) => {
          if (active === index) {
            return (
              <View style={[fill]}>
                <View style={[{ backgroundColor: "#F2F2F2" }]}>
                  {item?.video ? (
                    <VideoPlayer
                      video={{
                        uri: item?.video
                      }}
                      resizeMode="stretch"
                      thumbnail={{ uri: item?.video_thumbnail }}
                      disablFullscreen={false}
                      repeat={true}
                      controls={false}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        height: 220,
                        alignItems: "center"
                      }}
                    >
                      <Text bold style={{ fontSize: 20, color: "#626262" }}>
                        {"No video found"}
                      </Text>
                    </View>
                  )}
                </View>

                {repsWeightState?.set_type?.toLowerCase() === "cr" ? (
                  props.loader ? (
                    <View
                      style={[
                        secondaryBg,
                        { height: 50, justifyContent: "center" }
                      ]}
                    >
                      <ActivityIndicator size="small" color="green" />
                    </View>
                  ) : (
                    <View
                      style={[
                        row,
                        justifyContentCenter,
                        alignItemsEnd,
                        largeTPadding,
                        secondaryBg
                      ]}
                    >
                      <Text
                        text={workoutData?.cardio_length}
                        largeTitle
                        bold
                        style={{ color: "#626262" }}
                      />
                      <Text
                        text="minutes"
                        medium
                        bold
                        style={{ lineHeight: 34, color: "#626262" }}
                      />
                    </View>
                  )
                ) : (
                  <>
                    {repsWeightState?.set_type?.toLowerCase() === modal ? (
                      modal && props.loader ? (
                        <View
                          style={[
                            secondaryBg,
                            { height: 50, justifyContent: "center" }
                          ]}
                        >
                          <ActivityIndicator size="small" color="green" />
                        </View>
                      ) : (
                        <View
                          style={[
                            secondaryBg,
                            { height: 50, justifyContent: "flex-end" }
                          ]}
                        >
                          {checkModalType(modal)}
                        </View>
                      )
                    ) : null}

                    <View
                      style={[
                        row,
                        alignItemsCenter,
                        secondaryBg,
                        { height: 60, paddingHorizontal: 10 }
                      ]}
                    >
                      {/* <====================sets=====start======================> */}
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
                            bg={
                              repsWeightState?.id === set?.id &&
                              increment &&
                              "#d3d3d3"
                            }
                            repsWeightState={repsWeightState}
                          // disabled={timmer}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}
                {/* <====================sets===========end================> */}
                <View style={[fill, secondaryBg]}>
                  <ScrollView contentContainerStyle={[fillGrow]}>
                    {repsWeightState?.set_type?.toLowerCase() ===
                      "cr" ? null : (
                      <View style={[row, tinyHPadding]}>
                        <FatExerciseButton
                          reps
                          buttonLabel="Reps"
                          text={repsWeightState?.reps}
                          onPress={() => {
                            refReps.current.open()
                            setShowModalRepsTwo(
                              repsWeightState &&
                              repsWeightState?.set_type?.toLowerCase() ===
                              "ds"
                            )
                            setShowModalRepsThree(
                              repsWeightState &&
                              repsWeightState?.set_type?.toLowerCase() ===
                              "tds"
                            )
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
                            refWeight.current.open()
                            setShowModalWeightTwo(
                              repsWeightState &&
                              repsWeightState?.set_type?.toLowerCase() ===
                              "ds"
                            )
                            setShowModalWeightThree(
                              repsWeightState &&
                              repsWeightState?.set_type?.toLowerCase() ===
                              "tds"
                            )
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
                      // disabled={timmer}
                      />
                      <FatExerciseIconButton
                        buttonText="Swap Exercise"
                        buttonIcon={Images.iconSwap}
                        onPress={swipeFunc}
                        disabled={item && item.done}
                      />

                      <FatGradientIconButton
                        buttonText={
                          repsWeightState?.set_type?.toLowerCase() === "cr"
                            ? "Complete"
                            : item?.sets && item?.sets?.[activeSet]?.done
                              ? "Done"
                              : "Done, Start Rest"
                        }
                        buttonIcon={Images.iconDoneStartRest}
                        colorsGradient={["#3180BD", "#6EC2FA"]}
                        colorsGradientDisable={["#d3d3d3", "#838383"]}
                        disabled={
                          timmer ||
                          (item?.sets && item?.sets?.[activeSet]?.done)
                        }
                        onPress={() => {
                          setTimmer(true)
                          submitData(item)
                        }}
                      />
                    </View>
                    <RestContainer
                      upNext={"next"}
                      startRest={timmer}
                      activeSet={activeSet}
                      onPress={() => {
                        isCustom
                          ? props.customSessionDone(
                            workoutData.id,
                            screenNavigation
                          )
                          : props.sessionDone(
                            workoutData?.id,
                            screenNavigation
                          )
                        setStartTimer(false)
                        setTimmer(false)
                      }}
                      resetTime={item?.sets && item?.sets?.[activeSet]?.timer}
                      onFinish={() => {
                        getData()
                        setTimmer(false)
                        setStartTimer(false)
                      }}
                    />
                  </ScrollView>
                </View>
              </View>
            )
          }
        })
      ) : (
        <></>
      )}
      {/*===============================================*/}
      {/*===============================================*/}

      <BottomSheet reff={refDescription} h={400}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[fill, { width: "100%", marginTop: 20 }]}
        >
          <View style={[regularHMargin]}>
            {selectedExercise?.length !== 0 &&
              selectedExercise?.exercises?.[active]?.description ? (
              selectedExercise?.exercises?.[active]?.description
                ?.split("/n")
                .map(item => <Text text={item} style={{ color: "#626262" }} />)
            ) : (
              <Text
                text={"No Description is available!"}
                style={{ color: "#626262" }}
              />
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
        <View style={[justifyContentStart, fill]}>
          <View style={[row, center, { marginTop: 20 }]}>
            {checkModalType(modal)}
          </View>
          <>
            {modal === "ss" ? (
              <View style={[regularHMargin, regularVMargin]}>
                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Perform two consecutive exercises with no rest in between."
                  }
                />

                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={"Begin rest when second exercise is Complete."}
                />
              </View>
            ) : null}
          </>
          <>
            {modal === "gs" ? (
              <View style={[regularHMargin, regularVMargin]}>
                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Perform three consecutive exercises with no rest in between."
                  }
                />

                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={"Begin rest when the third exercise is complete."}
                />
              </View>
            ) : null}
          </>
          <>
            {modal === "ds" ? (
              <View style={[regularHMargin, regularVMargin]}>
                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Perform a round of the exercise with a certain weight, then reduce the weight to complete another round for more reps without resting immediately after. "
                  }
                />

                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Once both rounds of reps are complete, then begin your rest."
                  }
                />
              </View>
            ) : null}
          </>
          <>
            {modal === "tds" ? (
              <View style={[regularHMargin, regularVMargin]}>
                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Perform a round of the exercise with a certain weight, then reduce the weight to complete another round for more reps, then complete a third round without resting immediately after. "
                  }
                />

                <Text
                  style={smallVMargin}
                  medium
                  color="septenary"
                  text={
                    "Once all three rounds of reps are complete, then begin your rest."
                  }
                />
              </View>
            ) : null}
          </>

          <ScrollView
            contentContainerStyle={[fillGrow]}
            showsVerticalScrollIndicator={true}
          >
            {modal === "ss" || modal === "gs" ? (
              <>
                {selectedExercise?.exercises?.length > 0 ? (
                  selectedExercise?.exercises?.map((exercise, index) => {
                    return (
                      <View key={index} style={[justifyContentCenter]}>
                        <View
                          style={[
                            row,
                            fill,
                            regularVMargin,
                            justifyContentCenter
                          ]}
                        >
                          <Text
                            regularTitle
                            color="quinary"
                            text={`${(index + 1 === 1 && "a") ||
                              (index + 1 === 2 && "b") ||
                              (index + 1 === 3 && "c") ||
                              (index + 1 === 4 && "d")
                              }. ${exercise?.name}`}
                          />
                        </View>
                        <View style={center}>
                          <Image
                            source={{
                              uri: exercise?.video_thumbnail
                            }}
                            style={styles.modalImageStyle}
                          />
                        </View>
                      </View>
                    )
                  })
                ) : (
                  <>
                    <View style={[row, fill, center, regularVMargin]}>
                      <Text
                        regularTitle
                        color="quinary"
                        text={`1. ${selectedExercise?.exercises?.[active]?.name}`}
                      />
                    </View>
                    <View style={center}>
                      <Image
                        source={{
                          uri: selectedExercise?.exercises?.[active]
                            ?.video_thumbnail
                        }}
                        style={styles.modalImageStyle}
                      />
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <View style={[row, fill, center, regularVMargin]}>
                  <Text
                    regularTitle
                    color="quinary"
                    text={`1. ${selectedExercise?.exercises?.[active]?.name}`}
                  />
                </View>

                <View style={center}>
                  <Image
                    source={{
                      uri: selectedExercise?.exercises?.[active]
                        ?.video_thumbnail
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
                colors={["#fa201b", "#fe5b06"]}
                style={[
                  punchBg,
                  center,
                  row,
                  borderR10,
                  height40,
                  tiny2xHPadding,
                  {
                    width: "45%",
                    backgroundColor: "red"
                  }
                ]}
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
  )
}

const styles = StyleSheet.create({
  doneWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3
  },
  imageWrapper: {
    width: 20,
    height: 20
  },
  mainImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover"
  },
  lineStyle: { borderWidth: 1, width: 40, height: 1 },
  inputModalStyle: {
    paddingHorizontal: 8,
    borderRadius: 6,
    borderColor: Colors.nobel
  },
  modalButton: { height: 50 },
  inputStyle: { height: 50, backgroundColor: "#f5f5f5" },
  modalCrossIcon: { margin: 10 },
  modalImageStyle: {
    borderRadius: 20,
    width: 220,
    height: 170,
    resizeMode: "stretch"
  },
  leftIconStyle: {
    left: 0,
    zIndex: 22,
    top: "13%",
    position: "absolute"
  },
  leftImageStyle: { width: 30, height: 30, resizeMode: "contain" },
  timerStyle: { height: 30 },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    // height: 60,
    flexDirection: "row"
  }
})

const mapStateToProps = state => ({
  repsWeightState: state.programReducer.repsWeight,
  loader: state.programReducer.loader,
  // exerciseObj: state.programReducer.exerciseObj,
  // selectedSession: state.programReducer.selectedSession,
  // nextWorkout: state.programReducer.nextWorkout,
  setDone: state.programReducer.setDone,
  isCustom: state.programReducer.isCustom,
  workoutData: state.programReducer.workoutData,
  setDoneSuccess: state.programReducer.setDoneSuccess,
})

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  repsCustomWeightRequest: (id, data, dd, callBack) =>
    dispatch(repsCustomWeightRequest(id, data, dd, callBack)),
  repsWeightRequest: (id, data, dd, callBack) =>
    dispatch(repsWeightRequest(id, data, dd, callBack)),
  setDoneRequest: (id, data) => dispatch(setDoneRequest(id, data)),
  customSetDoneRequest: (id, data) => dispatch(customSetDoneRequest(id, data)),
  sessionDone: (id, screenNavigation) =>
    dispatch(sessionDone(id, screenNavigation)),
  customSessionDone: (id, screenNavigation) =>
    dispatch(customSessionDone(id, screenNavigation)),
  allSwapExercise: id => dispatch(allSwapExercise(id)),
  allSwapCustomExercise: id => dispatch(allSwapCustomExercise(id)),
  setExerciseTitle: type => dispatch(setExerciseTitle(type)),
  getCustomWorkoutDataRequest: id => dispatch(getCustomWorkoutDataRequest(id)),
  getCSVWorkoutDataRequest: id => dispatch(getCSVWorkoutDataRequest(id)),

})

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen)

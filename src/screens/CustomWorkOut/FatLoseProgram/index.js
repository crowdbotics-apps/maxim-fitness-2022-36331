import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native"

import moment from "moment"
import Icon from "react-native-vector-icons/FontAwesome5"
import { connect } from "react-redux"
import Modal from "react-native-modal"
import { CalendarList } from "react-native-calendars"
import LinearGradient from "react-native-linear-gradient"

import { Text, BottomSheet } from "../../../components"
import { Layout, Global, Gutters, Images, Colors } from "../../../theme"
import { letterCapitalize } from "../../../utils/functions"
import { exerciseArray } from "../../../utils/utils"
import {
  getDaySessionRequest,
  getAllSessionRequest,
  pickSession
} from "../../../ScreenRedux/programServices"

const FatLoseProgram = props => {
  const {
    navigation,
    todayRequest,
    todaySessions,
    getAllSessions,
    getWeekSessions,
    profile
  } = props
  let refDescription = useRef("")
  const [activeIndex, setActiveIndex] = useState(1)
  const [index, setIndex] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [data, setData] = useState({})

  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" }
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" }

  useEffect(() => {
    getWeekSessions?.query?.map((p, i) => {
      if (p.date_time === moment(new Date()).format("YYYY-MM-DD")) {
        !index && setIndex(p?.date_time)
      }
    })
    if (getWeekSessions?.date_in_week_number) {
      setActiveIndex(getWeekSessions?.date_in_week_number)
    }
  }, [getWeekSessions])

  const getWeek = date => {
    if (data) {
      const weekStartDates = Object.keys(data)
      const inputDate = new Date(date)
      for (let i = 0; i < weekStartDates.length; i++) {
        const weekStartDate = new Date(weekStartDates[i])
        const nextWeekStartDate = new Date(weekStartDates[i + 1])
        if (
          i === weekStartDates.length - 1 ||
          (inputDate >= weekStartDate && inputDate < nextWeekStartDate)
        ) {
          return `${i + 1 > 7 ? 2 : 1}`
        }
      }
      return 2
    }
  }

  useEffect(() => {
    getAllSessions?.query?.map((d, i) => {
      let dots = []
      if (d.cardio && d.strength) {
        dots = [vacation, massage]
      } else if (d.cardio) {
        dots = [vacation]
      } else if (d.strength) {
        dots = [massage]
      }

      setData(prevState => ({
        ...prevState,
        [d.date_time]: { ...prevState[d.date_time], dots: dots }
      }))
    })
  }, [getAllSessions])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const newDate = moment(new Date()).format("YYYY-MM-DD")
      props.getAllSessionRequest(newDate)
      props.getDaySessionRequest(newDate)
      setIndex(false)
    })
    return unsubscribe
  }, [navigation])

  const { etc, workout1, workout2, workout3, threeLine, circle } = Images
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout
  const { smallVMargin, regularHMargin, tinyLMargin } = Gutters

  const nextExercise = () => {
    if (getWeekSessions?.query?.length) {
      const today = new Date(getWeekSessions?.query[0].date_time)
      const lastDay = new Date(today.setDate(today.getDate() + 7))
      const date = moment(lastDay).format("YYYY-MM-DD")
      setIndex(date)

      props.getAllSessionRequest(date)
      props.getDaySessionRequest(date)
    }
  }

  const previousExercise = () => {
    if (getWeekSessions?.query?.length) {
      const today = new Date(getWeekSessions.query[0].date_time)
      const lastDay = new Date(today.setDate(today.getDate() - 7))
      const date = moment(lastDay).format("YYYY-MM-DD")
      setIndex(date)
      props.getAllSessionRequest(date)
      props.getDaySessionRequest(date)
    }
  }

  const selectDay = (item, i) => {
    const newDate = moment(item.date_time).format("YYYY-MM-DD")
    setIndex(newDate)
    props.getDaySessionRequest(newDate)
  }

  const pp = new Date(todaySessions?.id && todaySessions?.date_time)
  const weekDay = pp?.getDay()

  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 0 }

  // useEffect(() => {
  //   if (getWeekSessions) {
  //     getWeekSessions?.query?.map(item => {
  //       let currentD = moment(new Date()).format('YYYY-MM-DD');
  //       let cardDate = moment(item.date_time).format('YYYY-MM-DD');

  //       const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
  //         workoutItem => !workoutItem.done
  //       );

  //       if (currentD === cardDate && item.workouts.length > 0) {
  //         props.pickSession(itemWorkoutUndone, item.workouts, nextWorkout)
  //       }
  //     })
  //   }
  // }, [getWeekSessions])

  const selectExerciseObj = () => {
    getWeekSessions?.query?.map((item, index) => {
      if (todaySessions?.id === item.id) {
        const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
          workoutItem => !workoutItem.done
        )
        props.pickSession(itemWorkoutUndone, item.workouts, nextWorkout)
        refDescription.current.close()
        navigation.navigate("ExerciseScreen", {
          workouts: item?.workouts,
          item: item
        })
      }
    })
  }

  const openModal = () => {
    setIsModal(true)
    props.getAllSessionRequest("")
  }
  const onDayPress = date => {
    const checkWeek = getWeekSessions?.query?.find(
      obj => obj.date_time === date?.dateString
    )
    setIndex(date?.dateString)
    if (!checkWeek) {
      const newDate = moment(date?.dateString).format("YYYY-MM-DD")
      props.getAllSessionRequest(newDate)
      props.getDaySessionRequest(newDate)
    } else {
      const newDate = moment(date?.dateString).format("YYYY-MM-DD")
      props.getDaySessionRequest(newDate)
    }
    setIsModal(false)
  }

  const secondsToMinutes = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    // Format the result
    let formattedResult = `${minutes}`
    if (remainingSeconds > 0) {
      formattedResult += `:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`
    }

    return formattedResult
  }
  const d = new Date()
  const day = d.getDay()

  return (
    <SafeAreaView style={[fill, Global.secondaryBg]}>
      <ScrollView>
        <View style={[smallVMargin, regularHMargin]}>
          <Text style={styles.heading}>
            {letterCapitalize(profile?.first_name || profile?.username)}'s{" "}
            {exerciseArray[profile?.fitness_goal - 1]?.heading + " Program"}
          </Text>
          {!todayRequest && getWeekSessions?.query?.length > 0 && (
            <>
              {getWeekSessions?.query?.length > 6 ? (
                <View
                  style={[
                    row,
                    alignItemsCenter,
                    justifyContentBetween,
                    Gutters.small2xTMargin
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        row,
                        {
                          marginRight: 10,
                          opacity:
                            getWeekSessions?.prev_week_number === 0 ||
                            getWeekSessions?.prev_week_number === null
                              ? 0.5
                              : 1
                        }
                      ]}
                      onPress={previousExercise}
                      disabled={
                        getWeekSessions?.prev_week_number === 0 ||
                        getWeekSessions?.prev_week_number === null
                      }
                    >
                      <Icon
                        type="FontAwesome5"
                        name={"chevron-left"}
                        style={styles.IconStyle}
                      />
                      <Text
                        color="primary"
                        text={`Week ${
                          getWeekSessions?.prev_week_number === null
                            ? 1
                            : getWeekSessions?.prev_week_number
                        }`}
                        style={[tinyLMargin, styles.smallText]}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        row,
                        {
                          opacity:
                            getWeekSessions?.next_week_number === 0 ||
                            getWeekSessions?.next_week_number === null
                              ? 0.5
                              : 1
                        }
                      ]}
                      onPress={nextExercise}
                      disabled={
                        getWeekSessions?.next_week_number === 0 ||
                        getWeekSessions?.next_week_number === null
                      }
                    >
                      <Text
                        color="primary"
                        text={`Week ${
                          getWeekSessions?.date_in_week_number === 4
                            ? 4
                            : getWeekSessions?.date_in_week_number
                            ? getWeekSessions?.date_in_week_number + 1
                            : 4
                        }`}
                        style={[tinyLMargin, styles.smallText]}
                      />
                      <Icon
                        type="FontAwesome5"
                        name={"chevron-right"}
                        style={styles.IconStyle}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={row} onPress={openModal}>
                    <Text
                      text={"Calendar"}
                      style={[tinyLMargin, styles.CalenderText]}
                    />
                    <Icon
                      type="FontAwesome5"
                      name="chevron-right"
                      style={[styles.IconStyle, { color: "gray" }]}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={Layout.alignItemsCenter}>
                <ScrollView
                  horizontal
                  contentContainerStyle={[
                    Layout.fillGrow,
                    Layout.justifyContentBetween
                  ]}
                >
                  {getWeekSessions?.query?.map((d, i) => {
                    const day = new Date(d.date_time).getDate()
                    const weekDayName = moment(d.date_time).format("dd")
                    const selectDate = moment(d.date_time).format("YYYY-MM-DD")

                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => selectDay(d, i)}
                        style={{
                          marginHorizontal: 8,
                          marginVertical: 10,
                          alignItems: "center",
                          marginTop:
                            getWeekSessions?.query?.length < 6 ? 20 : 10
                        }}
                      >
                        <Text
                          text={
                            (weekDayName === "Tu" && "T") ||
                            (weekDayName === "We" && "W") ||
                            (weekDayName === "Th" && "T") ||
                            (weekDayName === "Fr" && "F") ||
                            (weekDayName === "Sa" && "S") ||
                            (weekDayName === "Su" && "S") ||
                            (weekDayName === "Mo" && "M")
                          }
                          style={{
                            fontSize: 15,
                            lineHeight: 18,
                            fontWeight: "bold",
                            opacity: 0.7,
                            color: "black"
                          }}
                        />
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            marginVertical: 5,
                            backgroundColor:
                              index === selectDate ? "#00a2ff" : "white",
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text
                            text={day}
                            style={{
                              fontSize: 15,
                              lineHeight: 18,
                              fontWeight: "bold",
                              color: index !== selectDate ? "#000" : "white"
                            }}
                          />
                        </View>
                        {d?.name !== "Rest" ? (
                          <View style={row}>
                            {d?.cardio && (
                              <View
                                style={{
                                  backgroundColor: "red",
                                  height: 6,
                                  width: 6,
                                  borderRadius: 10
                                }}
                              />
                            )}
                            {d?.strength && (
                              <View
                                style={{
                                  backgroundColor: "blue",
                                  left: 2,
                                  height: 6,
                                  width: 6,
                                  borderRadius: 10
                                }}
                              />
                            )}
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>
            </>
          )}
          {todayRequest ? (
            <View style={[Layout.center, { height: 280 }]}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : todaySessions?.length < 1 ? (
            <View style={[Layout.center, { height: 200 }]}>
              <Text text={"No workout found!"} style={styles.headind2} />
            </View>
          ) : todaySessions?.name && todaySessions?.name !== "Rest" ? (
            <View>
              <Text
                text={
                  todaySessions.date_time ===
                  moment(new Date()).format("YYYY-MM-DD")
                    ? "Today's Workout"
                    : `${moment(todaySessions.date_time).format(
                        "dddd"
                      )}'s Workout`
                }
                style={styles.headind2}
              />
              <View style={styles.cardView}>
                <View style={[row, justifyContentBetween]}>
                  <Text
                    text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day}`}
                    color="primary"
                    style={styles.dayText}
                  />
                  <TouchableOpacity
                    onPress={() => refDescription.current.open()}
                  >
                    <Image source={etc} style={styles.imgStyle} />
                  </TouchableOpacity>
                </View>
                <View style={[row, { flex: 1 }]}>
                  <View
                    style={[
                      row,
                      {
                        width: "36%",
                        marginTop: 5,
                        flexWrap: "wrap"
                      }
                    ]}
                  >
                    {todaySessions?.workouts &&
                      todaySessions?.workouts?.map((item, i) => (
                        <Image
                          source={{ uri: item?.exercise.exercise_type?.image }}
                          style={{
                            width: 50,
                            height: 50,
                            marginLeft: 5,
                            marginTop: i > 1 ? 5 : 0
                          }}
                        />
                      ))}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      width: "85%",
                      marginHorizontal: 10,
                      fllex: 1
                    }}
                  >
                    <View>
                      <Text
                        text={todaySessions?.name}
                        style={{
                          fontSize: 15,
                          lineHeight: 20,
                          fontWeight: "bold",
                          color: "#626262"
                        }}
                      />
                      <Text
                        text={`${todaySessions?.workouts?.length} exercies`}
                        style={{
                          fontSize: 12,
                          lineHeight: 12,
                          fontWeight: "400",
                          marginTop: 10,
                          color: "#626262"
                        }}
                      />
                    </View>

                    <View
                      style={[
                        row,
                        fill,
                        alignItemsCenter,
                        { marginVertical: 20, justifyContent: "space-between" }
                      ]}
                    >
                      <Text
                        text={`${todaySessions?.cardio_length} minutes`}
                        style={{
                          fontSize: 12,
                          lineHeight: 12,
                          fontWeight: "400",
                          color: "#626262"
                          // opacity: 0.7
                        }}
                      />
                      <Text
                        text="Steady State"
                        style={{
                          fontSize: 15,
                          lineHeight: 18,
                          fontWeight: "bold",
                          marginLeft: 30,
                          color: "#626262"
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={[row]}></View>
                <View style={[fill, center, Gutters.regularVMargin]}>
                  <TouchableOpacity onPress={selectExerciseObj}>
                    <LinearGradient
                      start={start}
                      end={end}
                      colors={["#00e200", "#00e268"]}
                      style={[
                        fill,
                        Gutters.small2xHPadding,
                        Gutters.regularVPadding,
                        styles.gradientWrapper
                      ]}
                    >
                      <Text
                        text="Start Workout"
                        style={{
                          fontSize: 16,
                          lineHeight: 18,
                          fontWeight: "bold",
                          color: "#545454"
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text text={"Rest day"} style={styles.headind2} />
              <View style={styles.cardView}>
                <View style={[row, justifyContentBetween]}>
                  <Text
                    text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day}`}
                    color="primary"
                    style={styles.dayText}
                  />
                  {/* <Image source={etc} style={styles.imgStyle} /> */}
                </View>
                <View style={[row, Gutters.smallVMargin]}>
                  <Text
                    text={
                      "No workout for today. We do encourage you to follow one of our quick stretching and mobility routines during your off days."
                    }
                    style={{
                      fontSize: 13,
                      lineHeight: 16,
                      color: "black",
                      fontWeight: "500",
                      textAlign: "left",
                      opacity: 0.8
                    }}
                  />
                </View>
                <View style={[fill, center, Gutters.regularVMargin]}>
                  <TouchableOpacity>
                    <LinearGradient
                      start={start}
                      end={end}
                      colors={["#00e200", "#00e268"]}
                      style={[
                        fill,
                        Gutters.small2xHPadding,
                        Gutters.regularVPadding,
                        styles.gradientWrapper
                      ]}
                    >
                      <Text
                        text="Find Routine"
                        style={{
                          fontSize: 16,
                          lineHeight: 18,
                          fontWeight: "bold",
                          color: "#545454"
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {!todayRequest && getWeekSessions?.query?.length > 0 && (
            <View style={[center, styles.cardView2]}>
              <Text
                text={"Create the a Custom Workout"}
                style={styles.heading3}
              />
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <Text
                  text={
                    "Design your own strength workout or choose an outdoor run, hike, walk, or bike ride using our GPS tracker and guided workouts."
                  }
                  style={styles.praText}
                />
              </View>
              <View style={[fill, center, Gutters.regularVMargin]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddExercise")}
                  // disabled={
                  //   todayRequest ||
                  //   todaySessions?.length === 0 ||
                  //   todaySessions?.name === "Rest"
                  // }
                >
                  <LinearGradient
                    start={start}
                    end={end}
                    colors={
                      // todayRequest ||
                      // todaySessions?.length === 0 ||
                      // todaySessions?.name === "Rest"
                      //   ? ["#dddddd", "#dddddd"]
                      //   :
                      ["#00a2ff", "#00a2ff"]
                    }
                    style={[
                      fill,
                      Gutters.small2xHPadding,
                      Gutters.regularVPadding,
                      styles.gradientWrapper
                    ]}
                  >
                    <Text
                      text="Create Workout"
                      style={{
                        fontSize: 16,
                        lineHeight: 18,
                        fontWeight: "bold",
                        color: "#fff"
                      }}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* calender */}
      <Modal
        visible={isModal}
        onBackdropPress={() => setIsModal(false)}
        style={[
          Global.halfOpacityBg,

          {
            padding: 0,
            margin: 0,
            paddingTop: 100
          }
        ]}
      >
        {props.requesting ? (
          <View
            style={[
              Layout.fill,
              Layout.center,
              Global.secondaryBg,
              Global.topLRBorderRadius20
            ]}
          >
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          <View style={[Global.topLRBorderRadius20, Global.secondaryBg]}>
            <CalendarList
              style={{ marginTop: 25 }}
              current={new Date().toISOString()}
              markingType={"multi-dot"}
              markedDates={data}
              hideExtraDays={true}
              firstDay={1}
              hideDayNames={true}
              pastScrollRange={0}
              onDayPress={onDayPress}
              futureScrollRange={12}
              scrollEnabled={true}
              showScrollIndicator={true}
              initialNumToRender={1}
            />
          </View>
        )}
      </Modal>
      {/* calender */}

      <BottomSheet
        reff={refDescription}
        h={200}
        Iconbg={"white"}
        bg={"white"}
        customStyles={{
          draggableIcon: {
            backgroundColor: "red"
          }
        }}
      >
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[
            {
              width: "100%",
              marginTop: 20,
              paddingLeft: 40,
              backgroundColor: "white"
            }
          ]}
        >
          <View style={[regularHMargin, {}]}>
            <TouchableOpacity
              style={[row, alignItemsCenter]}
              onPress={selectExerciseObj}
            >
              <Image source={threeLine} style={{ width: 50, height: 50 }} />
              <Text
                text={"View Workout"}
                style={{
                  fontSize: 20,
                  lineHeight: 22,
                  fontWeight: "bold",
                  opacity: 0.7,
                  color: "black",
                  marginLeft: 30
                }}
              />
            </TouchableOpacity>
            <View style={[row, alignItemsCenter, { marginTop: 20 }]}>
              <Image source={circle} style={{ width: 50, height: 50 }} />
              <Text
                text={"Resechedule Workout"}
                style={{
                  fontSize: 20,
                  lineHeight: 22,
                  fontWeight: "bold",
                  opacity: 0.7,
                  color: "black",
                  marginLeft: 30
                  // flex: 1
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 16,
    borderColor: Colors.azureradiance
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 40,
    marginTop: 10,
    // opacity: 0.8,
    color: "#626262"
  },
  smallText: { fontSize: 15, lineHeight: 18 },
  IconStyle: { color: Colors.primary, fontSize: 15, marginLeft: 3 },
  CalenderText: { fontSize: 15, lineHeight: 18, color: "gray" },
  headind2: {
    fontSize: 25,
    lineHeight: 30,
    color: "black",
    marginTop: 25,
    fontWeight: "bold",
    opacity: 0.6
  },
  cardView: {
    padding: 13,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5
  },
  dayText: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 5,
    fontWeight: "bold"
  },
  imgStyle: { height: 25, width: 30, marginRight: 10 },
  btn1: { height: 50, width: 140, alignSelf: "center", marginVertical: 10 },
  cardView2: {
    borderWidth: 2,
    padding: 13,
    marginTop: 40,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderColor: Colors.primary
  },
  heading3: {
    fontSize: 15,
    lineHeight: 20,
    color: "black",
    fontWeight: "bold"
  },
  praText: {
    fontSize: 12,
    lineHeight: 16,
    color: "gray",
    fontWeight: "500",
    textAlign: "left"
  },
  btn2: { height: 50, width: 150, alignSelf: "center", marginTop: 10 }
})

const mapStateToProps = state => ({
  todayRequest: state.programReducer.todayRequest,
  todaySessions: state.programReducer.todaySessions,
  requesting: state.programReducer.requesting,
  getAllSessions: state.programReducer.getAllSessions,
  getWeekSessions: state.programReducer.getWeekSessions,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  getDaySessionRequest: data => dispatch(getDaySessionRequest(data)),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  pickSession: (exerciseObj, selectedSession, nextWorkout) =>
    dispatch(pickSession(exerciseObj, selectedSession, nextWorkout))
})
export default connect(mapStateToProps, mapDispatchToProps)(FatLoseProgram)

import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList
} from "react-native"

import moment from "moment"
import Icon from "react-native-vector-icons/FontAwesome5"
import { connect } from "react-redux"
import Modal from "react-native-modal"
import { CalendarList } from "react-native-calendars"
import LinearGradient from "react-native-linear-gradient"
import DatePicker from "react-native-date-picker"
//utils imports
import { Text, BottomSheet, SubscriptionCard } from "../../../components"
import { Layout, Global, Gutters, Images, Colors } from "../../../theme"
import { letterCapitalize } from "../../../utils/functions"
import { exerciseArray } from "../../../utils/utils"
import { Dimensions } from "react-native"

//redux imports
import {
  addCustomExercise,
  getCustomExerciseRequest,
  customWorkoutRescheduleRequest
} from "../../../ScreenRedux/addExerciseRedux"
import {
  getDaySessionRequest,
  getAllSessionRequest,
  // pickSession,
  setCustom,
  setPickedDate
} from "../../../ScreenRedux/programServices"
import { profileData } from "../../../ScreenRedux/profileRedux"
import ReactNativeCalendarStrip from "react-native-calendar-strip"
import { useIsFocused } from "@react-navigation/native"
import { verificationRequest } from "../../../ScreenRedux/loginRedux"

const FatLoseProgram = props => {
  const {
    navigation,
    todayRequest,
    cRequesting,
    todaySessions,
    getAllSessions,
    getWeekSessions,
    profile,
    getCustomExerciseState,
    profileData,
    getAllSessionsRequesting,
    verificationRequest,
    verifyRequesting
  } = props
  const onFocus = useIsFocused()
  let refDescription = useRef("")
  const [activeIndex, setActiveIndex] = useState(1)
  const [index, setIndex] = useState(moment().format('YYYY-MM-DD'))
  const [isModal, setIsModal] = useState(false)
  const [customWorkout, setCustomWorkout] = useState(false)
  const [customWorkoutData, setCustomWorkoutData] = useState([])
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [data, setData] = useState({})
  const [expanded, setExpanded] = useState(false);
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" }
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" }


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
    getWeekSessions?.query?.map((p, i) => {
      if (p.date_time === moment(new Date()).format("YYYY-MM-DD")) {
        !index && setIndex(p?.date_time)
      }
    })
    if (getWeekSessions?.date_in_week_number) {
      setActiveIndex(getWeekSessions?.date_in_week_number)
    }
  }, [getWeekSessions, onFocus])

  const getInitialData = async () => {
    const newDate = moment(new Date()).format("YYYY-MM-DD")
    profileData()
    await props.getAllSessionRequest("")
    await props.getAllSessionRequest(newDate)
    await props.getDaySessionRequest(newDate)
    await props.getCustomExerciseRequest(newDate)
    setIndex(newDate)
  }
  useEffect(() => {
    getInitialData()
    verificationRequest()
  }, [onFocus, navigation])

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
    props.getCustomExerciseRequest(newDate)
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

  const reScheduleWorkout = (date) => {
    const resetDate = moment(date).format("YYYY-MM-DD")
    if (customWorkout) {
      props.customWorkoutRescheduleRequest(customWorkoutData?.id, resetDate)

    } else {
      getWeekSessions?.query?.map((item, index) => {
        if (todaySessions?.id === item.id) {
          //await  props.workoutRescheduleRequest(item.id, resetDate) //make new action in reducer if CSV program required to schedule

        }
      })
    }
    getInitialData()

  }
  const selectExerciseObj = async (data, id) => {
    if (id) {
      const [itemWorkoutUndone, nextWorkout] = data.workouts.filter(
        workoutItem => !workoutItem.done
      )
      refDescription.current.close()
      props.setCustom(true)
      navigation.navigate("ExerciseScreen", {
        item: data
      })
    } else {
      getWeekSessions?.query?.map((item, index) => {
        if (todaySessions?.id === item.id) {
          const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
            workoutItem => !workoutItem.done
          )
          refDescription.current.close()
          props.setCustom(false)
          navigation.navigate("ExerciseScreen", {
            item: item
          })
        }
      })
    }
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
      formattedResult += `:${remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`
    }

    return formattedResult
  }
  const d = new Date()
  const day = d.getDay()
  const getTotalExerciseCount = workouts => {
    let total = 0
    workouts?.forEach(workout => {
      total += workout?.exercises?.length || 0
    })
    return total
  }
  const getTotalTimeInMinutes = workouts => {
    let total = 0

    workouts?.forEach(workout => {
      workout?.exercises?.forEach(exercise => {
        exercise?.sets?.forEach(set => {
          total += (set?.timer || 0) / 60
        })
      })
    })

    return Math.round(total)
  }


  const getTotalExerciseTimeInMinutes = exercises => {
    let total = 0

    exercises?.forEach(exercise => {
      exercise?.sets?.forEach(set => {
        total += (set?.timer || 0) / 60
      })
    })
    return Math.round(total)
  }

  const screenWidth = Dimensions.get('window').width;



  const groupExerciseTypes = (data) => {
    const groupedExercises = {};
    data?.workouts?.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const exerciseTypeId = exercise.exercise_type.id;

        if (!groupedExercises[exerciseTypeId]) {
          // Initialize the exercise type group data if it doesn't exist
          groupedExercises[exerciseTypeId] = {
            exercise_type: exercise.exercise_type,
            exercises: []
          };
        }

        groupedExercises[exerciseTypeId].exercises.push(exercise);
      });
    });

    const groupedExerciseArray = Object.values(groupedExercises);
    return groupedExerciseArray;
  };


  const renderSortedData = (item) => {
    const sortedData = groupExerciseTypes(item)

    return sortedData.map((data, index) => {

      return (
        <View style={[row,]} key={index}>
          <View>
            {data?.exercise_type?.image?.length ?
              <Image
                source={{
                  uri: data?.exercise_type?.image,
                }}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 5,
                  marginTop: index > 1 ? 5 : 0,
                }}
              /> :
              <Text
                style={{
                  color: '#626262',
                  width: 50,
                  height: 50,
                  marginLeft: 5,
                  marginTop: 5,
                }}
              >
                No Image
              </Text>}

          </View>
          <View style={{ marginHorizontal: 10 }}>
            <View>
              <Text
                text={`${data?.exercises?.length || 1} exercises`}
                style={{
                  fontSize: 12,
                  lineHeight: 12,
                  fontWeight: '400',
                  marginTop: 10,
                  color: '#626262',
                }}
              />
            </View>

            <View
              style={[
                row,
                fill,
                alignItemsCenter,
                {
                  marginVertical: 20,
                  justifyContent: 'space-between',
                },
              ]}
            >
              <Text
                text={`${getTotalExerciseTimeInMinutes(data?.exercises)} minutes`}
                style={{
                  fontSize: 12,
                  lineHeight: 12,
                  fontWeight: '400',
                  color: '#626262',
                }}
              />

            </View>
            <View>

            </View>
          </View>
          <View>
            <Text
              text={`${data?.exercise_type?.name}`}
              style={{
                fontSize: 15,
                lineHeight: 18,
                fontWeight: 'bold',
                marginLeft: 50,
                marginTop: 20,
                color: '#626262',
              }}
            />
          </View>
        </View>
      )
    })
  };


  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const renderCard = item => {


    return (
      <View style={{ margin: 5, flex: 1 }}>
        <View style={[{ width: screenWidth - 39, },]}>

          <View style={[styles.cardView,]}>
            <View style={[{ height: expanded ? 'auto' : 240 }]}>
              <View style={[row, justifyContentBetween]}>
                <Text
                  text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day}`}
                  color="primary"
                  style={styles.dayText}
                />
                <TouchableOpacity
                  onPress={() => {
                    refDescription.current.open();
                    setCustomWorkoutData(item);
                    setCustomWorkout(true);
                  }}
                >
                  <Image source={etc} style={styles.imgStyle} />
                </TouchableOpacity>
              </View>
              <View style={[row]}>
                <Text
                  text={`Workout Name: ${item?.name}`}
                  style={{
                    flex: 1,
                    fontSize: 15,
                    lineHeight: 20,
                    marginBottom: 20,
                    fontWeight: 'bold',
                    color: '#626262',
                  }}
                />
                {groupExerciseTypes(item)?.length > 2 &&
                  <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={{ color: 'blue', textAlign: 'center' }}>
                      {expanded ? 'Show Less' : 'Show More'}
                    </Text>
                  </TouchableOpacity>}
              </View>
              <View style={{ flexDirection: 'column' }}>
                {/* {hasImages ? ( */}
                {renderSortedData(item)}
                {/* ) : ( */}

                {/* )} */}
              </View>
            </View>
            <View style={[row]}></View>
            <View style={[fill, center, Gutters.regularVMargin]}>
              <TouchableOpacity onPress={() => selectExerciseObj(item, true)}>
                <LinearGradient
                  start={start}
                  end={end}
                  colors={['#00e200', '#00e268']}
                  style={[
                    fill,
                    Gutters.small2xHPadding,
                    Gutters.regularVPadding,
                    styles.gradientWrapper,
                  ]}
                >
                  <Text
                    text="Start Workout"
                    style={{
                      fontSize: 16,
                      lineHeight: 18,
                      fontWeight: 'bold',
                      color: '#545454',
                    }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const checkDisabled = (data) => {
    return data?.workouts?.some(workout =>
      workout?.exercises?.some(exercise =>
        exercise?.sets?.some(set => set.done)
      )
    );
  }

  const showPromoCard =
    (todaySessions?.name !== "Rest" || todaySessions?.length > 1) && profile.is_premium_user && todaySessions?.name
  return (
    <SafeAreaView style={[fill, Global.secondaryBg]}>
      <ScrollView>
        <View style={[smallVMargin, regularHMargin]}>
          <Text style={styles.heading}>
            {letterCapitalize(profile?.first_name || profile?.username)}'s{" "}
            {exerciseArray[profile?.fitness_goal - 1]?.heading + " Program"}
          </Text>
          {profile?.is_premium_user && (
            <>
              {/* <====================week calender==================start=> */}
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
                            text={`Week ${getWeekSessions?.prev_week_number === null
                              ? 1
                              : getWeekSessions?.prev_week_number
                              }`}
                            style={[tinyLMargin, styles.smallText]}
                          />
                        </TouchableOpacity>
                        {getWeekSessions?.next_week_number === 0 ||
                          getWeekSessions?.next_week_number === null ? (
                          <View
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
                            <Icon
                              type="FontAwesome5"
                              name={"chevron-right"}
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                                marginLeft: -5,
                                marginTop: 2
                              }}
                            />
                          </View>
                        ) : (
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
                              text={`Week ${getWeekSessions?.date_in_week_number === 4
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
                        )}
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
                            ) : (
                              <></>
                            )}
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>
                </>
              )}
            </>)}
          <>
            {!profile?.is_premium_user || getWeekSessions?.query?.length === 0 ? (
              <ReactNativeCalendarStrip
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'background', duration: 200, highlightColor: '#00a2ff' }}
                style={{ height: 100, paddingTop: 20, paddingBottom: 10, marginHorizontal: 7 }}
                calendarHeaderStyle={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginBottom: 20 }}
                calendarColor={'white'}
                dateNumberStyle={{ color: 'black' }}
                dateNameStyle={{ color: 'blue', }}
                highlightDateNumberStyle={{ color: 'white' }}
                highlightDateNameStyle={{ color: 'white' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey' }}
                minDate={moment(index).format('YYYY-MM-DD')}
                selectedDate={index ?? moment().format('YYYY-MM-DD')}
                onDateSelected={date => {
                  const newDate = moment(date).format("YYYY-MM-DD")
                  setIndex(newDate)
                  props.getCustomExerciseRequest(newDate)
                }}
              />

            ) : <></>}
          </>
          {/* <====================week calender==================start=> */}

          {!profile?.is_premium_user && (
            <>
              <SubscriptionCard
                cardHeading="Buy Subscription"
                cardDescription="To enjoy our program, a subscription is required. Subscribe now for uninterrupted access to premium content"
                buttonText="Find a Workout Program"
              />
            </>
          )}
          {todayRequest || cRequesting || getAllSessionsRequesting || verifyRequesting ? (
            <View style={[Layout.center, { height: 280 }]}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : todaySessions?.length < 1 &&
            getCustomExerciseState?.length < 1 ? (
            <View style={[Layout.center, { height: 200 }]}>
              <Text text={"No workout found!"} style={styles.headind2} />
            </View>
          ) : (todaySessions?.name && todaySessions?.name !== "Rest") ||
            getCustomExerciseState?.length > 0 ? (
            <>
              {showPromoCard ? (
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
                    style={[styles.headind2]}
                  />
                  <View style={styles.cardView}>
                    <View style={[{ height: expanded ? 'auto' : 40 }]}>
                      <View style={[row, justifyContentBetween]}>
                        <Text
                          text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day
                            }`}
                          color="primary"
                          style={styles.dayText}
                        />
                        <TouchableOpacity
                          onPress={() => refDescription.current.open()}
                        >
                          <Image source={etc} style={styles.imgStyle} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={[row]}>
                      <Text
                        text={`Workout Name: ${todaySessions?.name}`}
                        style={{
                          flex: 1,
                          fontSize: 15,
                          lineHeight: 20,
                          marginBottom: 20,
                          fontWeight: 'bold',
                          color: '#626262',
                        }}
                      />
                      {groupExerciseTypes(todaySessions)?.length > 3 &&
                        <TouchableOpacity onPress={toggleExpanded}>
                          <Text style={{ color: 'blue', textAlign: 'center' }}>
                            {expanded ? 'Show Less' : 'Show More'}
                          </Text>
                        </TouchableOpacity>}
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      {renderSortedData(todaySessions)}

                      <View
                        style={{
                          flex: 1,
                          width: "85%",
                          marginHorizontal: 10,
                          fllex: 1
                        }}
                      >

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
                <></>
              )}
              {getCustomExerciseState?.length ? (
                <>
                  <Text
                    text={
                      todaySessions.date_time ===
                        moment(new Date()).format("YYYY-MM-DD")
                        ? "Today's Custom Workout"
                        : `${moment(todaySessions.date_time).format(
                          "dddd"
                        )}'s Custom Workout`
                    }
                    style={[styles.headind2]}
                  />
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={getCustomExerciseState || []}
                    renderItem={data => renderCard(data.item)}
                    horizontal={true}
                    contentContainerStyle={{ paddingRight: 10 }}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ) : profile.is_premium_user ? (
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
                  <TouchableOpacity
                    onPress={() => {
                      props.addCustomExercise([])
                      props.setPickedDate(index)
                      navigation.navigate("AddExercise")
                    }}
                  >
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
          ) : (
            <></>
          )}

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
                onPress={() => {
                  props.addCustomExercise([])
                  props.setPickedDate(index)
                  navigation.navigate("AddExercise")
                }}
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
        {getAllSessionsRequesting ? (
          <View
            style={[
              Layout.fill,
              Layout.center,
              Global.secondaryBg,
              Global.topLRBorderRadius20
            ]}
          >
            {/* <ActivityIndicator size="large" color="green" /> */}
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
        onClose={() => setCustomWorkout(false)}
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
              onPress={() =>
                selectExerciseObj(customWorkoutData, customWorkout)
              }
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
            <TouchableOpacity
              style={[row, alignItemsCenter, { marginTop: 20, }]}
              onPress={() =>
                setOpenDatePicker(true)
              }
              disabled={!customWorkout || checkDisabled(customWorkoutData)}
            >
              <Image source={circle} style={{ width: 50, height: 50 }} />
              <Text
                text={"Reschedule Workout"}
                style={{
                  fontSize: 20,
                  lineHeight: 22,
                  fontWeight: "bold",
                  opacity: 0.7,
                  color: "black",
                  marginLeft: 30,
                  color: !customWorkout || checkDisabled(customWorkoutData) ? 'gray' : 'black'
                  // flex: 1
                }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        // date={customWorkout?.length ? new Date(customWorkoutData?.created_date) : new Date(todaySessions?.date_time) }
        date={new Date()}
        onConfirm={date => {
          refDescription.current.close()
          setOpenDatePicker(false)
          reScheduleWorkout(date)
        }}
        onCancel={() => {
          refDescription.current.close()
          setOpenDatePicker(false)
        }}
        minimumDate={new Date()}
        maximumDate={
          customWorkout ? new Date('2049-12-1') :
            new Date(
              getWeekSessions?.query?.[
                getWeekSessions?.query?.length - 1
              ]?.date_time || new Date('2049-12-1')
            )
        }
      />
    </SafeAreaView >
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
  profile: state.login.userDetail,
  getAllSessionsRequesting: state.addExerciseReducer.getAllSessionsRequesting,
  cRequesting: state.addExerciseReducer.cRequesting,
  getCustomExerciseState: state.addExerciseReducer.getCustomExerciseState,
  verifyRequesting: state.login.verifyRequesting
})

const mapDispatchToProps = dispatch => ({
  profileData: () => dispatch(profileData()),
  getCustomExerciseRequest: date => dispatch(getCustomExerciseRequest(date)),
  getDaySessionRequest: data => dispatch(getDaySessionRequest(data)),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  setCustom: type => dispatch(setCustom(type)),
  setPickedDate: date => dispatch(setPickedDate(date)),
  addCustomExercise: () => dispatch(addCustomExercise([])),
  customWorkoutRescheduleRequest: (id, date) =>
    dispatch(customWorkoutRescheduleRequest(id, date)),
  verificationRequest: () => dispatch(verificationRequest())

})
export default connect(mapStateToProps, mapDispatchToProps)(FatLoseProgram)
